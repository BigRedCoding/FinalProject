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
  query,
}) {
  const location = useLocation();

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(3);
  const [articlesList, setArticlesList] = useState([]);
  const [numberOfResultsShown, setNumberOfResultsShown] = useState(0);

  const [test, setTest] = useState([]);
  const [articleCards, setArticleCards] = useState([]);

  const seeMoreDisabled = currentPage >= totalPages / pageSize;
  const seeLessDisabled = currentPage <= totalPages / pageSize;

  const disableButton = seeMoreDisabled ? "isHidden" : "";
  const disableButton1 = seeLessDisabled ? "isHidden" : "";

  const printConsole = () => {
    console.log(allArticles);
  };

  const handlePageChange = async (newPage) => {
    setLoading(true);

    const startIndex = (newPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    let newResults = articlesList?.slice(startIndex, endIndex);

    setCurrentPage(newPage);

    setTest(newResults);
    setLoading(false);
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

  const initialSetUp = () => {
    let localArticles = [];

    for (let i = 0; i < test.length; i++) {
      if (test.length !== localArticles.length) {
        const item = articlesList[i];

        localArticles.push(
          <NewsCard
            key={i}
            data={item}
            onArticleLike={onArticleLike}
            onArticleFavorite={onArticleFavorite}
          />
        );
      }
      setArticleCards(localArticles);
    }
  };

  useEffect(() => {
    if (test?.length > 0) {
      const testLength = test.length;
      setNumberOfResultsShown(testLength);
      initialSetUp();
    }
  }, [test]);

  useEffect(() => {
    if (articlesList?.length > 0) {
      handlePageChange(1);
    }
  }, [articlesList]);

  useEffect(() => {
    if (allArticles?.length > 0) {
      setTotalPages(allArticles.length);
      setArticlesList(allArticles);
    }
  }, [allArticles, isSubmitted]);

  return (
    <section className="news-section">
      <div className="news-section__search-results">
        {loading && <Preloader />}
        {!loading && isSubmitted && (
          <ul className="news-section__results-list">
            {articleCards?.length > 0 ? (
              articleCards
            ) : (
              <li>
                <p>No results found.</p>
              </li>
            )}
          </ul>
        )}
      </div>
      {!loading && isSubmitted && (
        <div className="news-section__navigation-container">
          <button
            className={`news-section__navigation-button ${disableButton}`}
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={seeLessDisabled}
          >
            See less
          </button>

          <span className="news-section__navigation-span">
            Showing {numberOfResultsShown} of {totalPages}
          </span>

          <button
            className={`news-section__navigation-button ${disableButton1}`}
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={seeMoreDisabled}
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
    </section>
  );
}
