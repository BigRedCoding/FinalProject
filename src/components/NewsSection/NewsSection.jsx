import "./NewsSection.css";
import { useState, useEffect } from "react";

import Preloader from "../Preloader/Preloader.jsx";
import NewsCard from "../NewsCard/NewsCard.jsx";
import FailedSearch from "../FailedSearch/FailedSearch.jsx";

export default function NewsSection({
  loading,
  allArticles,
  isSubmitted,
  onArticleLike,
  onArticleFavorite,
  query,
  isProfileSelected,
  onRegistrationClick,
  failedSearch,
}) {
  const [filteredArticles, setFilteredArticles] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalCards, setTotalCards] = useState(1);
  const [cardsShown, setCardsShown] = useState(3);

  const [numberOfResultsShown, setNumberOfResultsShown] = useState(0);

  const seeMoreDisabled = currentPage >= totalCards / cardsShown;
  const seeLessDisabled = currentPage === 1;
  const disableButton = seeMoreDisabled ? "isHidden" : "";
  const disableButton1 = seeLessDisabled ? "isHidden" : "";

  const maxPages = allArticles.length / cardsShown;

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [listChange, triggerListChange] = useState(false);

  const [updateFilter, setUpdateFilter] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handlePageChange = (page) => {
    if (page > 0 || page < maxPages) {
      const numberOfResultsToShow = page * cardsShown;
      const cardsToShow = allArticles.slice(0, numberOfResultsToShow);

      setFilteredArticles(cardsToShow);
      setCurrentPage(page);
    }
  };

  const updateFiltered = () => {
    console.log("update filter trigger:", updateFilter);
    if (updateFilter === true) {
      const cardsToShow = allArticles.slice(0, cardsShown);
      setFilteredArticles(cardsToShow);
    }
    setUpdateFilter(false);
  };

  const setPages = () => {
    console.log("set pages triggered");
    if (listChange === true) {
      const pageSize = 4;
      setCardsShown(pageSize);
    } else {
      const pageSize = isProfileSelected === "home" ? 3 : 6;
      setCardsShown(pageSize);
    }
    console.log(listChange);
    const totalArticles = allArticles.length;
    setTotalCards(totalArticles);
    setUpdateFilter(true);
  };

  useEffect(() => {
    updateFiltered();
  }, [updateFilter]);

  useEffect(() => {
    setPages();
  }, [windowWidth]);

  useEffect(() => {
    console.log("window width use effect trigger:", windowWidth);
    if (windowWidth < 540) {
      triggerListChange(false);
    } else if (windowWidth < 720) {
      triggerListChange(true);
    } else if (windowWidth < 881) {
      triggerListChange(false);
    } else if (windowWidth < 1265) {
      triggerListChange(true);
    } else if (windowWidth > 1265) {
      triggerListChange(false);
    }
  }, [windowWidth]);

  useEffect(() => {
    if (filteredArticles.length > 0) {
      setNumberOfResultsShown(filteredArticles.length);
    }
  }, [filteredArticles]);

  useEffect(() => {
    if (allArticles?.length > 0) {
      setPages();
    }
  }, [allArticles]);
  return (
    <section className="news-section">
      <div className="news-section__search-results">
        {loading && <Preloader />}
        {!loading && !failedSearch && (
          <div className="news-section__results-container">
            <ul className="news-section__results-list">
              {filteredArticles.map((article, index) => (
                <NewsCard
                  key={index}
                  data={article}
                  onArticleLike={onArticleLike}
                  onArticleFavorite={onArticleFavorite}
                  onRegistrationClick={onRegistrationClick}
                />
              ))}
            </ul>
          </div>
        )}

        {!loading && isSubmitted && !failedSearch && (
          <div className="news-section__navigation-container">
            <button
              className={`news-section__navigation-button ${disableButton1}`}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              See less
            </button>
            <span className="news-section__navigation-span">
              Showing {numberOfResultsShown} of {totalCards}
            </span>
            <button
              className={`news-section__navigation-button ${disableButton}`}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              See more
            </button>
          </div>
        )}
        {failedSearch && isSubmitted && <FailedSearch />}
      </div>
    </section>
  );
}
