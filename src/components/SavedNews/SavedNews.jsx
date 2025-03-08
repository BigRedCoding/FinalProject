import "./SavedNews.css";

import { useContext, useEffect, useState } from "react";

import Navigation from "../Navigation/Navigation";
import NewsSection from "../NewsSection/NewsSection";

import CurrentUserContext from "../../contexts/CurrentUserContext";

export default function SavedNews({
  onLoginClick,
  setNavigationSelection,
  onEditProfileClick,
  onLogoutClick,
  navigationSelection,
  onArticleLike,
  onArticleFavorite,
  articlesTotal,
  onRegistrationClick,
}) {
  const { userData } = useContext(CurrentUserContext);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(true);

  const [loading, setLoading] = useState(false);

  const userName = userData?.userName || "";

  const numberSaved = filteredArticles?.length || "0";

  const failedSearch = false;

  const keywords = filteredArticles
    ?.filter((article) => article.keywords.length > 0)
    .map((article) => article.keywords)
    .flat()
    .filter((value, index, self) => self.indexOf(value) === index)
    .map((keyword) => keyword.charAt(0).toUpperCase() + keyword.slice(1));

  const keywordsPhase =
    keywords.length > 2
      ? `${keywords.slice(0, 2).join(", ")}, and ${keywords.length - 2} other`
      : keywords.join(", ") || "no key words associated";

  const filterArticlesByFavorites = () => {
    setFilteredArticles(
      articlesTotal.filter((article) =>
        article.favorites.includes(userData.userId)
      )
    );
  };

  useEffect(() => {
    if (articlesTotal?.length >= 0) {
      filterArticlesByFavorites();
    }
  }, [articlesTotal]);

  useEffect(() => {
    filterArticlesByFavorites();
    setNavigationSelection("profile");
  }, []);

  return (
    <section className="saved-news">
      <Navigation
        onLoginClick={onLoginClick}
        setNavigationSelection={setNavigationSelection}
        onEditProfileClick={onEditProfileClick}
        onLogoutClick={onLogoutClick}
        navigationSelection={navigationSelection}
      />
      <div className="saved-news__header">
        <p className="saved-news__title">Saved articles</p>
        <h1 className="saved-news__saved-text">
          {userName}, you have {numberSaved} saved articles
        </h1>
        <p className="saved-news__keywords-text">
          By keywords: <span className="saved-news__span">{keywordsPhase}</span>
        </p>
      </div>
      <div className="saved-news__saved-container">
        {filteredArticles.length > 0 ? (
          <NewsSection
            loading={loading}
            allArticles={filteredArticles}
            isSubmitted={isSubmitted}
            onArticleLike={onArticleLike}
            onArticleFavorite={onArticleFavorite}
            navigationSelection={navigationSelection}
            onRegistrationClick={onRegistrationClick}
            failedSearch={failedSearch}
          />
        ) : (
          <p className="saved-news__no-articles">
            No saved articles! Check the "likes" section or go to the home page
            and search for more!
          </p>
        )}
      </div>
    </section>
  );
}
