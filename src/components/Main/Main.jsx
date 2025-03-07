import "./Main.css";
import React, { useState, useContext } from "react";

import About from "../About/About.jsx";
import NewsSection from "../NewsSection/NewsSection.jsx";
import Navigation from "../Navigation/Navigation.jsx";

import { searchArticles } from "../../utils/NewsApis/newsapp.js";
import { getGnewsNews } from "../../utils/NewsApis/Gnews.js";
import { getNewsData } from "../../utils/NewsApis/newsdata.js";

export default function Main({
  onLoginClick,
  onRegistrationClick,
  setIsProfileSelected,
  onEditProfileClick,
  onLogoutClick,
  isProfileSelected,
  onArticleLike,
  onArticleFavorite,
  articlesTotal,
}) {
  const [query, setQuery] = useState("");

  const [loading, setLoading] = useState(false);

  const [isSubmitted, setIsSubmitted] = useState(false);

  const [currentResults, setCurrentResults] = useState([]);

  const [failedSearch, setFailedSearch] = useState(false);

  const [placeholderDefault, setPlaceHolderDefault] = useState("Enter topic");

  const handleChange = (e) => {
    const inputValue = e.target.value;
    setQuery(inputValue);
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
    const searchWords = query.toLowerCase().split(/\s+/);
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

  const setLikesAndFavorites = (results) => {
    const orderedResults = orderByDate(results);

    const updateOrderedResults = () => {
      return orderedResults.map((orderedItem) => {
        const matchedItem = articlesTotal.find((article) => {
          return (
            article.author === orderedItem.author &&
            article.title === orderedItem.title &&
            article.description === orderedItem.description &&
            article.imageUrl === orderedItem.imageUrl &&
            article.url === orderedItem.url &&
            article.source === orderedItem.source
          );
        });
        return matchedItem ? { ...orderedItem, ...matchedItem } : orderedItem;
      });
    };

    const updatedResults = updateOrderedResults();

    setCurrentResults(updatedResults);

    setLoading(false);
    setIsSubmitted(true);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);

    let results = [];

    const storedResults = localStorage.getItem("searchResults");

    if (storedResults) {
      results = JSON.parse("storedResults");
    } else {
      const resultsArray = [];
      const resultsNewsApp = await searchArticles(query);
      const resultsGnewsNews = await getGnewsNews(query);
      const resultsNewsData = await getNewsData(query);

      resultsArray.push(...resultsNewsApp);
      resultsArray.push(...resultsGnewsNews);
      resultsArray.push(...resultsNewsData);

      results = orderByDate(resultsArray);

      if (resultsArray?.length < 0) {
        setFailedSearch(true);
        return;
      }

      localStorage.setItem("searchResults", JSON.stringify(results));
    }
    const mostFrequentWord = findMostFrequentWord(results);
    const updatedList = addKeywordToArticles(results, mostFrequentWord);

    setLikesAndFavorites(updatedList);
  };

  return (
    <div className="main">
      <Navigation
        onLoginClick={onLoginClick}
        setIsProfileSelected={setIsProfileSelected}
        onEditProfileClick={onEditProfileClick}
        onLogoutClick={onLogoutClick}
        isProfileSelected={isProfileSelected}
      />
      <section className="main__search">
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
                value={query}
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
                  value={query}
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
            allArticles={currentResults}
            isSubmitted={isSubmitted}
            onArticleLike={onArticleLike}
            onArticleFavorite={onArticleFavorite}
            query={query}
            isProfileSelected={isProfileSelected}
            onRegistrationClick={onRegistrationClick}
            failedSearch={failedSearch}
          />
        </div>
      ) : (
        <div></div>
      )}

      <About />
    </div>
  );
}
