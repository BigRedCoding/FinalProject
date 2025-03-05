import "./Main.css";
import React, { useState, useContext } from "react";
import { useLocation } from "react-router-dom";

import About from "../About/About.jsx";
import NewsSection from "../NewsSection/NewsSection.jsx";
import Navigation from "../Navigation/Navigation.jsx";

//News Api's
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

  const orderByDate = (array) => {
    let shuffledArray = [...array];
    shuffledArray.sort((b, a) => new Date(a.date) - new Date(b.date));
    return shuffledArray;
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

    const storedResults = localStorage.getItem("searchResults");

    if (storedResults) {
      const results = JSON.parse(storedResults);

      setLikesAndFavorites(results);
    } else {
      const resultsArray = [];
      const resultsNewsApp = await searchArticles(query);
      const resultsGnewsNews = await getGnewsNews(query);
      const resultsNewsData = await getNewsData(query);

      resultsArray.push(...resultsNewsApp);
      resultsArray.push(...resultsGnewsNews);
      resultsArray.push(...resultsNewsData);

      const results = orderByDate(resultsArray);

      setLikesAndFavorites(results);

      localStorage.setItem("searchResults", JSON.stringify(results));
    }
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
            <form className="main__news-form" onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Enter topic"
                value={query}
                className="main__news-input"
                onChange={(e) => setQuery(e.target.value)}
              />
              <button className="main__news-submit-button" type="submit">
                Search
              </button>
            </form>
            <div className="main__form-container-mobile">
              <form className="main__news-form-mobile" onSubmit={handleSearch}>
                <input
                  type="text"
                  placeholder="Enter topic"
                  value={query}
                  className="main__news-input-mobile"
                  onChange={(e) => setQuery(e.target.value)}
                />
              </form>{" "}
              <button className="main__submit-button-mobile" type="submit">
                Search
              </button>
            </div>
          </div>
        </div>
      </section>
      <div className="main__saved-container">
        {isSubmitted ? (
          <NewsSection
            loading={loading}
            setLoading={setLoading}
            allArticles={currentResults}
            isSubmitted={isSubmitted}
            onArticleLike={onArticleLike}
            onArticleFavorite={onArticleFavorite}
            query={query}
            isProfileSelected={isProfileSelected}
            onRegistrationClick={onRegistrationClick}
          />
        ) : (
          <div></div>
        )}
      </div>
      <About />
    </div>
  );
}
