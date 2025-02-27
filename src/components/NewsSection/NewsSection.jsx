import "./NewsSection.css";
import { useState, useEffect } from "react";
import Preloader from "../Preloader/Preloader.jsx";
import NewsCard from "../NewsCard/NewsCard.jsx";

export default function NewsSection({
  loading,
  query,
  allArticles,
  setLoading,
  isSubmitted,
  onArticleLike,
  onArticleFavorite,
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(3);
  const [resultsToShow, setResultsToShow] = useState([]);

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
  }, []);

  useEffect(() => {
    setTotalPages(Math.ceil(allArticles.length / pageSize));
    setResultsToShow(allArticles.slice(0, pageSize));
  }, [isSubmitted, pageSize, allArticles]);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;

    setLoading(true);
    setCurrentPage(newPage);

    const startIndex = (newPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    const newResults = allArticles.slice(0, endIndex);
    setResultsToShow(newResults);
    setLoading(false);
  };

  const printConsole = () => {
    console.log(allArticles);
  };

  return (
    <section className="news-section">
      <div className="news-section__search-results">
        <div className="news-section__search-results">
          {loading && <Preloader />}
          {isSubmitted === true && (
            <>
              <h2 className="news-section__results-text">Search Results</h2>
              <ul className="news-section__results-list">
                {resultsToShow.length > 0 ? (
                  resultsToShow.map((article, index) => (
                    <li key={index}>
                      <NewsCard
                        data={article}
                        onArticleLike={onArticleLike}
                        onArticleFavorite={onArticleFavorite}
                      />
                    </li>
                  ))
                ) : (
                  <li>
                    <p>No results found.</p>
                  </li>
                )}
              </ul>

              <div className="news-section__navigation-container">
                <button
                  className="news-section__navigation-button"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  See less
                </button>
                <span className="news-section__navigation-span">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  className="news-section__navigation-button"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages}
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
          {allArticles.length > 0 && !isSubmitted && (
            <>
              <h2 className="news-section__results-text">Search Results</h2>
              <ul className="news-section__results-list">
                {allArticles.length > 0 ? (
                  allArticles.map((article, index) => (
                    <li key={index}>
                      <NewsCard
                        data={article}
                        onArticleLike={onArticleLike}
                        onArticleFavorite={onArticleFavorite}
                      />
                    </li>
                  ))
                ) : (
                  <li>
                    <p>No results found.</p>
                  </li>
                )}
              </ul>

              <div className="news-section__navigation-container">
                <button
                  className="news-section__navigation-button"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  See less
                </button>
                <span className="news-section__navigation-span">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  className="news-section__navigation-button"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages}
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
      </div>
    </section>
  );
}
