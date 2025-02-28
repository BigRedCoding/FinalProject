import "./NewsSection.css";
import { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";

import Preloader from "../Preloader/Preloader.jsx";
import NewsCard from "../NewsCard/NewsCard.jsx";
import { all } from "axios";

export default function NewsSection({
  loading,
  query,
  allArticles,
  setLoading,
  isSubmitted,
  onArticleLike,
  onArticleFavorite,
  setTrigger,
  trigger,
  articlesLiked,
  articlesFavorited,
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(3);

  const [numberOfResultsShown, setNumberOfResultsShown] = useState("0");
  const [hideButton, triggerDisableButton] = useState(false);

  const [test, setTest] = useState([]);

  console.log(test);

  const disableButton = hideButton === true ? "isHidden" : "";

  const location = useLocation();

  const handlePageChange = (newPage, data) => {
    const startIndex = 0;
    const multiplier = (newPage - 1) * pageSize;
    const endIndex = multiplier + pageSize;

    let newResults;

    if (data.length < 1) {
      setLoading(true);
      newResults = [];
    }

    setLoading(true);
    newResults = data.slice(startIndex, endIndex) || [];

    setTest(newResults);
    setCurrentPage(newPage);
    setTotalPages(data?.length);

    setNumberOfResultsShown(newResults?.length);

    if (newResults?.length < pageSize) {
      triggerDisableButton(true);
    }

    setTrigger(false);
    setLoading(false);
  };

  const printConsole = () => {
    console.log(allArticles);
  };

  const triggerUpdateResults = () => {
    let updatedResults = [];

    updatedResults = [];

    if (location.pathname === "/") {
      for (let i = 0; i < allArticles.length; i++) {
        const article = allArticles[i];
        updatedResults.push(
          <NewsCard
            key={i}
            data={article}
            onArticleLike={onArticleLike}
            onArticleFavorite={onArticleFavorite}
            setTrigger={setTrigger}
            trigger={trigger}
            triggerUpdateResults={triggerUpdateResults}
            articlesLiked={articlesLiked}
            articlesFavorited={articlesFavorited}
          />
        );
      }
    } else if (location.pathname === "/liked-by-server") {
      for (let i = 0; i < articlesLiked.length; i++) {
        const article = articlesLiked[i];
        updatedResults.push(
          <NewsCard
            key={i}
            data={article}
            onArticleLike={onArticleLike}
            onArticleFavorite={onArticleFavorite}
            setTrigger={setTrigger}
            trigger={trigger}
            triggerUpdateResults={triggerUpdateResults}
            articlesLiked={articlesLiked}
            articlesFavorited={articlesFavorited}
          />
        );
      }
    } else if (location.pathname === "/saved-news") {
      for (let i = 0; i < articlesFavorited.length; i++) {
        const article = articlesFavorited[i];
        updatedResults.push(
          <NewsCard
            key={i}
            data={article}
            onArticleLike={onArticleLike}
            onArticleFavorite={onArticleFavorite}
            setTrigger={setTrigger}
            trigger={trigger}
            triggerUpdateResults={triggerUpdateResults}
            articlesLiked={articlesLiked}
            articlesFavorited={articlesFavorited}
          />
        );
      }
    }
    handlePageChange(1, updatedResults);
  };

  useEffect(() => {
    const updatePageSize = () => {
      const width = window.innerWidth;
      if (width >= 1265) {
        setPageSize(3);
      } else if (width >= 850) {
        setPageSize(4);
      } else if (width >= 730) {
        setPageSize(3);
      } else {
        setPageSize(1);
      }
    };

    updatePageSize();
    window.addEventListener("resize", updatePageSize);

    return () => {
      window.removeEventListener("resize", updatePageSize);
    };
  }, [location.pathname]);

  useEffect(() => {
    setTest([]);
    triggerUpdateResults();
    console.log("trigger update results");
  }, [trigger, articlesLiked, articlesFavorited]);

  return (
    <section className="news-section">
      <div className="news-section__search-results">
        {loading && <Preloader />}
        {isSubmitted && location.pathname && (
          <>
            <h2 className="news-section__results-text">Search Results</h2>
            <ul className="news-section__results-list">
              {test?.length > 0 ? (
                test
              ) : (
                <li>
                  <p>No results found.</p>
                </li>
              )}
            </ul>

            <div className="news-section__navigation-container">
              <button
                className={`news-section__navigation-button ${disableButton}`}
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                See less
              </button>
              <span className="news-section__navigation-span">
                Showing {numberOfResultsShown} of {totalPages}
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
                disabled={currentPage >= totalPages}
              >
                See data
              </button>
            </div>
          </>
        )}
        {!isSubmitted && location.pathname !== "/" && (
          <>
            <ul className="news-section__results-list">
              {test?.length > 0 ? (
                test
              ) : (
                <li>
                  <p>No results found.</p>
                </li>
              )}
            </ul>

            <div className="news-section__navigation-container">
              <button
                className={`news-section__navigation-button ${disableButton}`}
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                See less
              </button>
              <span className="news-section__navigation-span">
                Showing {numberOfResultsShown} of {totalPages}
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
                disabled={currentPage >= totalPages}
              >
                See data
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
