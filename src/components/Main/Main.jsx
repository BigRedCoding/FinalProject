import "./Main.css";
import React, { useState, useContext } from "react";

import About from "../About/About.jsx";
import NewsSection from "../NewsSection/NewsSection.jsx";
import Navigation from "../Navigation/Navigation.jsx";

//News Api's
import { searchArticles } from "../../utils/NewsApis/newsapp.js";
import { getGnewsNews } from "../../utils/NewsApis/Gnews.js";
import { getNewsData } from "../../utils/NewsApis/newsdata.js";
import CurrentUserContext from "../../contexts/CurrentUserContext.js";

export default function Main({
  onLoginClick,
  setIsProfileSelected,
  onEditProfileClick,
  onLogoutClick,
  isProfileSelected,
  onArticleLike,
  onArticleFavorite,
  articlesTotal,
}) {
  const { currentSearchDataMain, setCurrentSearchDataMain } =
    useContext(CurrentUserContext);

  const [query, setQuery] = useState("");

  const [loading, setLoading] = useState(false);

  const [isSubmitted, setIsSubmitted] = useState(false);

  const [currentResults, setCurrentResults] = useState([]);

  const shuffleArray = (array) => {
    let shuffledArray = [...array];
    shuffledArray.sort((b, a) => new Date(a.date) - new Date(b.date));
    return shuffledArray;
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);

    const storedResults = localStorage.getItem("randomizedResults");

    if (storedResults) {
      const parsedResults = JSON.parse(storedResults);

      setCurrentResults(parsedResults);
      setLoading(false);
      setIsSubmitted(true);
    } else {
      const resultsArray = [];
      const resultsNewsApp = await searchArticles(query);
      const resultsGnewsNews = await getGnewsNews(query);
      const resultsNewsData = await getNewsData(query);

      resultsArray.push(...resultsNewsApp);
      resultsArray.push(...resultsGnewsNews);
      resultsArray.push(...resultsNewsData);

      const shuffledResults = shuffleArray(resultsArray);

      setCurrentResults(shuffledResults);

      localStorage.setItem(
        "randomizedResults",
        JSON.stringify(shuffledResults)
      );

      setLoading(false);
      setIsSubmitted(true);
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
            <form className="main__news-form" onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Search for articles"
                value={query}
                className="main__news-input"
                onChange={(e) => setQuery(e.target.value)}
              />
              <button className="main__news-submit-button" type="submit">
                Search
              </button>
            </form>
          </div>
        </div>
      </section>
      <div className="main__saved-container">
        {currentSearchDataMain ? (
          <NewsSection
            loading={loading}
            setLoading={setLoading}
            allArticles={currentResults}
            isSubmitted={isSubmitted}
            onArticleLike={onArticleLike}
            onArticleFavorite={onArticleFavorite}
            query={query}
          />
        ) : (
          <div></div>
        )}
      </div>
      <About />
    </div>
  );
}
