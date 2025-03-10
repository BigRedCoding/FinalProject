import "./Main.css";
import React, { useState, useEffect, useRef, useContext } from "react";

import { NewsBackgroundImages } from "../../utils/constants.js";

import About from "../About/About.jsx";
import NewsSection from "../NewsSection/NewsSection.jsx";
import Navigation from "../Navigation/Navigation.jsx";

import { searchArticles } from "../../utils/NewsApis/newsapp.js";
import { getGnewsNews } from "../../utils/NewsApis/Gnews.js";
import { getNewsData } from "../../utils/NewsApis/newsdata.js";
import CurrentUserContext from "../../contexts/CurrentUserContext.js";

export default function Main({
  onLoginClick,
  onRegistrationClick,
  setNavigationSelection,
  onEditProfileClick,
  onLogoutClick,
  navigationSelection,
  onArticleLike,
  onArticleFavorite,
  searchResults,
  setSearchResults,
  searchQuery,
  setSearchQuery,
  updateSearchResults,
  mainPageSelection,
  setMainPageSelection,
  likedBySelection,
  setLikedBySelection,
  profileSelection,
  setProfileSelection,
}) {
  const { userData } = useContext(CurrentUserContext);
  const [initialTrigger, setInitialTrigger] = useState(false);

  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [failedSearch, setFailedSearch] = useState(false);
  const [placeholderDefault, setPlaceHolderDefault] = useState("Enter topic");

  const [backgroundImage, setBackgroundImage] = useState(
    NewsBackgroundImages[0]
  );
  const [transitionState, setTransitionState] = useState("fade-in");

  const currentIndexRef = useRef(0);

  const handleChange = (e) => {
    const inputValue = e.target.value;
    setSearchQuery(inputValue);
    if (inputValue.length < 1) {
      setPlaceHolderDefault("Please enter a keyword");
    }
  };

  const orderByDate = (array) => {
    let shuffledArray = [...array];
    shuffledArray.sort((b, a) => new Date(a.date) - new Date(b.date));
    return shuffledArray;
  };

  const addKeywordToArticles = (articles, mostFrequentWord) => {
    return articles.map((article) => {
      if (article.keywords) {
        if (!article.keywords.includes(mostFrequentWord)) {
          article.keywords.push(mostFrequentWord);
        }
      } else {
        article.keywords = [mostFrequentWord];
      }
      return article;
    });
  };

  const findMostFrequentWord = (articles) => {
    const searchWords = searchQuery.toLowerCase().split(/\s+/);
    const wordCount = {};

    articles.forEach((article) => {
      const combinedText =
        `${article.author} ${article.title} ${article.description} ${article.source}`.toLowerCase();
      searchWords.forEach((word) => {
        if (combinedText.includes(word)) {
          wordCount[word] = (wordCount[word] || 0) + 1;
        }
      });
    });

    let mostFrequentWord = null;
    let maxCount = 0;

    Object.keys(wordCount).forEach((word) => {
      if (wordCount[word] > maxCount) {
        mostFrequentWord = word;
        maxCount = wordCount[word];
      }
    });

    return mostFrequentWord || "No matching words found";
  };

  const handleSearch = async (e) => {
    setLoading(true);
    setIsSubmitted(true);
    e.preventDefault();

    if (searchQuery.length < 1) {
      setPlaceHolderDefault("Please enter a keyword");
      return;
    }
    let results = [];

    const resultsArray = [];
    const resultsNewsApp = await searchArticles(searchQuery);
    const resultsGnewsNews = await getGnewsNews(searchQuery);
    const resultsNewsData = await getNewsData(searchQuery);

    resultsArray.push(...resultsNewsApp);
    resultsArray.push(...resultsGnewsNews);
    resultsArray.push(...resultsNewsData);

    results = orderByDate(resultsArray);
    if (
      resultsNewsApp?.length < 1 &&
      resultsGnewsNews?.length < 1 &&
      resultsNewsData?.length < 1
    ) {
      setFailedSearch(true);
      return;
    }

    const mostFrequentWord = findMostFrequentWord(results);
    const updatedList = addKeywordToArticles(results, mostFrequentWord);
    setSearchResults(updatedList);
    setLoading(false);
  };

  const changeImage = () => {
    setTransitionState("fade-out");
    const backgroundImagesLength = NewsBackgroundImages.length;

    setTimeout(() => {
      if (currentIndexRef.current < backgroundImagesLength - 1) {
        currentIndexRef.current += 1;
        setBackgroundImage(NewsBackgroundImages[currentIndexRef.current]);
      } else {
        setBackgroundImage(NewsBackgroundImages[0]);
        currentIndexRef.current = 0;
      }
      setTransitionState("fade-in");
    }, 2000);
  };
  useEffect(() => {
    if (navigationSelection === "home") {
      if (searchResults.length > 0) {
        setIsSubmitted(true);
      }
      if (searchResults.length < 1) {
        setIsSubmitted(false);
      }
    }
  }, [navigationSelection]);

  useEffect(() => {
    if (searchResults.length > 0) {
      updateSearchResults();
    }
  }, [userData]);

  useEffect(() => {
    if (initialTrigger === false) {
      setBackgroundImage(NewsBackgroundImages[0]);
      const intervalId = setInterval(changeImage, 7000);
      setInitialTrigger(true);
      return () => clearInterval(intervalId);
    }
  }, []);

  return (
    <div className="main">
      <Navigation
        onLoginClick={onLoginClick}
        setNavigationSelection={setNavigationSelection}
        onEditProfileClick={onEditProfileClick}
        onLogoutClick={onLogoutClick}
        navigationSelection={navigationSelection}
      />
      <section className="main__search">
        <div className="main__search-image-container">
          <img
            src={backgroundImage}
            alt="Assorted news backgrounds"
            className={`main__search-image ${transitionState}`}
          />
        </div>

        <div className="main__search-container">
          <div className="main__search-container-inner">
            <p className="main__search-container-title">
              What's going on in the world?
            </p>
            <p className="main__search-container-sub">
              Find the latest news on any topic and save them in your personal
              account.
            </p>
            <div className="main__news-search"></div>
            <form
              id="search-primary"
              className="main__news-form"
              onSubmit={handleSearch}
            >
              <input
                name="search-primary"
                type="text"
                placeholder={placeholderDefault}
                value={searchQuery}
                className="main__news-input"
                onChange={(e) => handleChange(e)}
              />
              <button className="main__news-submit-button" type="submit">
                Search
              </button>
            </form>
            <div className="main__form-container-mobile">
              <form id="search-secondary" className="main__news-form-mobile">
                <input
                  name="search-secondary"
                  type="text"
                  placeholder={placeholderDefault}
                  value={searchQuery}
                  className="main__news-input-mobile"
                  onChange={(e) => handleChange(e)}
                />
              </form>
              <button
                type="button"
                onClick={handleSearch}
                className="main__submit-button-mobile"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </section>
      {isSubmitted ? (
        <div className="main__saved-container">
          <NewsSection
            loading={loading}
            allArticles={searchResults}
            isSubmitted={isSubmitted}
            onArticleLike={onArticleLike}
            onArticleFavorite={onArticleFavorite}
            navigationSelection={navigationSelection}
            onRegistrationClick={onRegistrationClick}
            failedSearch={failedSearch}
            mainPageSelection={mainPageSelection}
            setMainPageSelection={setMainPageSelection}
            likedBySelection={likedBySelection}
            setLikedBySelection={setLikedBySelection}
            profileSelection={profileSelection}
            setProfileSelection={setProfileSelection}
          />
        </div>
      ) : (
        <div></div>
      )}

      <About />
    </div>
  );
}
