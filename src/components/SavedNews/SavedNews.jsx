import "./SavedNews.css";

import { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import Navigation from "../Navigation/Navigation";
import NewsSection from "../NewsSection/NewsSection";

import CurrentUserContext from "../../contexts/CurrentUserContext";

export default function SavedNews({
  onLoginClick,
  setIsProfileSelected,
  onEditProfileClick,
  onLogoutClick,
  isProfileSelected,
  onArticleLike,
  onArticleFavorite,
  onSetFavoriteArticles,
}) {
  const { userData, articlesFavorited } = useContext(CurrentUserContext);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [isArticlesFetched, setIsArticlesFetched] = useState(false);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const userName = userData?.userName || "";

  const numberSaved = userData?.savedArticles?.length || "0";
  const keywords =
    userData?.savedArticles?.map((article) => article.keywords).join(", ") ||
    "no key words associated";

  const location = useLocation();

  useEffect(() => {
    if (articlesFavorited?.length > 0) {
      setFilteredArticles(articlesFavorited);
    }
  }, [articlesFavorited]);

  useEffect(() => {
    if (location.pathname === "/saved-news" && isArticlesFetched === false) {
      onSetFavoriteArticles();
    }
    setIsArticlesFetched(true);
  }, [location.pathname]);

  return (
    <section className="saved-news">
      <Navigation
        onLoginClick={onLoginClick}
        setIsProfileSelected={setIsProfileSelected}
        onEditProfileClick={onEditProfileClick}
        isProfileSelected={isProfileSelected}
        onLogoutClick={onLogoutClick}
      />
      <div className="saved-news__header">
        <p className="saved-news__title">Saved articles</p>
        <h1 className="saved-news__saved-text">
          {userName}, you have {numberSaved} saved articles
        </h1>
        <p className="saved-news__keywords-text">By keywords: {keywords}</p>
      </div>
      <div className="liked-by-server__saved-container">
        {filteredArticles.length > 0 ? (
          <NewsSection
            loading={loading}
            query={query}
            allArticles={filteredArticles}
            setLoading={setLoading}
            onArticleLike={onArticleLike}
            onArticleFavorite={onArticleFavorite}
          />
        ) : (
          <li className="liked-by-server__no-articles">No saved articles!</li>
        )}
      </div>
    </section>
  );
}
