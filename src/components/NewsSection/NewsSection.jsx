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
  navigationSelection,
  onRegistrationClick,
  failedSearch,
  mainPageSelection,
  setMainPageSelection,
  likedBySelection,
  setLikedBySelection,
  profileSelection,
  setProfileSelection,
}) {
  const widthInital = window.innerWidth;

  const [windowWidth, setWindowWidth] = useState(0);
  const [localTotal, setLocalTotal] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [filteredArticlesList, setFilteredArticlesList] = useState([]);

  const [totalCards, setTotalCards] = useState(0);
  const [cardsShown, setCardsShown] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [numberOfResultsShown, setNumberOfResultsShown] = useState(0);

  const [listChange, setListChange] = useState(false);

  const [navShown, setNavShown] = useState(false);

  const seeMoreDisabled = currentPage >= totalCards / cardsShown;
  const seeLessDisabled = currentPage === 1 || localTotal.length < cardsShown;
  const disableButton = seeMoreDisabled ? "isHidden" : "";
  const disableButton1 = seeLessDisabled ? "isHidden" : "";

  const setSavedVariables = (page) => {
    console.log("set saved variables function");
    if (navigationSelection === "home") {
      setMainPageSelection(page);
    }
    if (navigationSelection === "likedbyserver") {
      setLikedBySelection(page);
    }
    if (navigationSelection === "profile") {
      setProfileSelection(page);
    }
  };

  const resizer = () => {
    console.log("resizer function");
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  };

  const handlePageChange = (page) => {
    console.log("handle page change", page);
    const maxPages = Math.ceil(localTotal?.length / cardsShown);
    let pageInput = page;

    if (maxPages <= pageInput) {
      pageInput = maxPages;
    }
    if (page < 1) {
      pageInput = 1;
    }
    if (pageInput > 0 && pageInput <= maxPages) {
      const numberOfResultsToShow = pageInput * cardsShown;
      const cardsToShow = localTotal?.slice(0, numberOfResultsToShow);

      console.log(maxPages, numberOfResultsShown, cardsShown);

      setFilteredArticles(cardsToShow);
      setCurrentPage(pageInput);
    }
    const totalArticles = localTotal.length;
    setTotalCards(totalArticles);
  };

  const setPages = () => {
    if (listChange === true) {
      console.log("set page function: true");
      setCardsShown(4);
    } else {
      const pageSize = navigationSelection === "home" ? 3 : 6;
      console.log("set page function: false");
      setCardsShown(pageSize);
    }
    const totalArticles = localTotal.length;
    setTotalCards(totalArticles);
  };

  const setPageWidth = () => {
    console.log("set page width function", windowWidth);
    setListChange(!!listChange);
    if (windowWidth < 540) {
      setListChange(false);
    } else if (windowWidth < 720) {
      setListChange(true);
    } else if (windowWidth < 881) {
      setListChange(false);
    } else if (windowWidth < 1265) {
      setListChange(true);
    } else if (windowWidth > 1265) {
      setListChange(false);
    }
  };

  const setPageByNavigation = () => {
    console.log("set page by navigation function");
    if (navigationSelection === "home") {
      if (mainPageSelection > 0) {
        handlePageChange(mainPageSelection);
      }
      return;
    }
    if (navigationSelection === "likedbyserver") {
      if (likedBySelection > 0) {
        handlePageChange(likedBySelection);
      }
      return;
    }
    if (navigationSelection === "profile") {
      if (profileSelection > 0) {
        handlePageChange(profileSelection);
      }
      return;
    }
  };
  useEffect(() => {
    if (currentPage > 0 && filteredArticlesList.length > 0) {
      console.log("current page set saved useEffect");
      setSavedVariables(currentPage);
    }
  }, [currentPage]);

  useEffect(() => {
    console.log("filter articles useEffect");
    if (filteredArticles.length > 0) {
      console.log(filteredArticles);
      const createdList = filteredArticles.map((article, index) => (
        <NewsCard
          key={index}
          data={article}
          onArticleLike={onArticleLike}
          onArticleFavorite={onArticleFavorite}
          onRegistrationClick={onRegistrationClick}
          navigationSelection={navigationSelection}
        />
      ));

      console.log(createdList);
      setFilteredArticlesList(createdList);
      setNumberOfResultsShown(filteredArticles.length);
    }
    if (filteredArticles.length < 1) {
      handlePageChange(currentPage);
    }
  }, [filteredArticles, loading]);

  console.log(currentPage);

  useEffect(() => {
    console.log("cards shown useEffect");
    if (cardsShown > 0) {
      setPageByNavigation();
    }
  }, [cardsShown]);

  useEffect(() => {
    console.log("local total useEffect");
    if (localTotal.length > 0) {
      setNavShown(true);
      setPageByNavigation();
    }
    if (localTotal.length < 1) {
      setNavShown(false);
    }
  }, [localTotal]);

  useEffect(() => {
    console.log("set total articles useEffected");
    if (allArticles.length > 0) {
      setLocalTotal(allArticles);
    }
  }, [allArticles, loading]);

  useEffect(() => {
    console.log("list change use effect");
    setPages();
  }, [listChange]);

  useEffect(() => {
    console.log("window width useEffect");
    resizer();
    setPageWidth();
    setPageByNavigation();
  }, [windowWidth, navigationSelection]);

  useEffect(() => {
    console.log("initial set page useEffect");
    setPageWidth();
    setWindowWidth(widthInital);
  }, []);

  return (
    <section className="news-section">
      <div className="news-section__search-results">
        {loading && isSubmitted && <Preloader />}
        {!loading && isSubmitted && !failedSearch && (
          <div className="news-section__results-container">
            <ul className="news-section__results-list">
              {filteredArticlesList}
            </ul>
          </div>
        )}

        {!loading && isSubmitted && !failedSearch && navShown && (
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
