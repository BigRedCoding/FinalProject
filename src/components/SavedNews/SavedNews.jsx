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
  articlesLiked,
  articlesFavorited,
  setTrigger,
  trigger,
}) {
  const { userData } = useContext(CurrentUserContext);
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
    if (location.pathname === "/saved-news" && isArticlesFetched === false) {
      onSetFavoriteArticles();
    }
    setIsArticlesFetched(true);
    setIsProfileSelected("profile");
  }, [location.pathname]);

  useEffect(() => {
    if (articlesFavorited) {
      setFilteredArticles(articlesFavorited);
    }
  }, [trigger, articlesFavorited, location.pathname, userData]);

  return (
    <section className="saved-news">
      <Navigation
        onLoginClick={onLoginClick}
        setIsProfileSelected={setIsProfileSelected}
        onEditProfileClick={onEditProfileClick}
        isProfileSelected={isProfileSelected}
        onLogoutClick={onLogoutClick}
        setTrigger={setTrigger}
        trigger={trigger}
      />
      <div className="saved-news__header">
        <p className="saved-news__title">Saved articles</p>
        <h1 className="saved-news__saved-text">
          {userName}, you have {numberSaved} saved articles
        </h1>
        <p className="saved-news__keywords-text">By keywords: {keywords}</p>
      </div>
      <div className="saved-news__saved-container">
        {filteredArticles.length > 0 ? (
          <NewsSection
            loading={loading}
            query={query}
            allArticles={filteredArticles}
            setLoading={setLoading}
            onArticleLike={onArticleLike}
            onArticleFavorite={onArticleFavorite}
            setTrigger={setTrigger}
            trigger={trigger}
            articlesLiked={articlesLiked}
            articlesFavorited={articlesFavorited}
          />
        ) : (
          <p className="liked-by-server__no-articles">No saved articles!</p>
        )}
      </div>
    </section>
  );
}
