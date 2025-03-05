import "./NewsSection.css";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import Preloader from "../Preloader/Preloader.jsx";
import NewsCard from "../NewsCard/NewsCard.jsx";

export default function NewsSection({
  loading,
  setLoading,
  allArticles,
  isSubmitted,
  onArticleLike,
  onArticleFavorite,
  isProfileSelected,
  query,
  onRegistrationClick,
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

  const printConsole = () => {
    console.log(allArticles);
  };

  const handlePageChange = (page) => {
    if (page > 0 || page < maxPages) {
      const numberOfResultsToShow = page * cardsShown;
      const cardsToShow = allArticles.slice(0, numberOfResultsToShow);

      setFilteredArticles(cardsToShow);
      setCurrentPage(page);
    }
  };

  const setPages = () => {
    const pageSize = isProfileSelected === "home" ? 3 : 6;
    const totalArticles = allArticles.length;

    setCardsShown(pageSize);
    setTotalCards(totalArticles);
  };

  useEffect(() => {
    if (filteredArticles.length > 0) {
      setNumberOfResultsShown(filteredArticles.length);
    }
  }, [filteredArticles]);

  useEffect(() => {
    if (totalCards > 0) {
      const cardsToShow = allArticles.slice(0, cardsShown);

      setFilteredArticles(cardsToShow);
    }
  }, [totalCards]);

  useEffect(() => {
    if (allArticles?.length > 0) {
      setPages();
    }
  }, [allArticles]);
  return (
    <section className="news-section">
      <div className="news-section__search-results">
        {loading && <Preloader />}
        {!loading && (
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

        {!loading && isSubmitted && (
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
            <button
              className="news-section__navigation-button"
              onClick={printConsole}
            >
              See data
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
