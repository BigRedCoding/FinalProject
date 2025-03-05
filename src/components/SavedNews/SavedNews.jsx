import "./SavedNews.css";

import { useContext, useEffect, useState } from "react";

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
  articlesTotal,
  onRegistrationClick,
}) {
  const { userData } = useContext(CurrentUserContext);
  const [filteredArticles, setFilteredArticles] = useState([]);

  const [loading, setLoading] = useState(false);

  const userName = userData?.userName || "";

  const numberSaved = filteredArticles?.length || "0";

  const isSubmitted = true;

  const keywords =
    userData?.filteredArticles?.map((article) => article.keywords).join(", ") ||
    "no key words associated";

  const filterArticlesByFavorites = () => {
    console.log("filter by favorites trigger");
    setFilteredArticles(
      articlesTotal.filter((article) =>
        article.favorites.includes(userData.userId)
      )
    );
  };

  useEffect(() => {
    if (articlesTotal.length >= 0) {
      filterArticlesByFavorites();
    }
  }, [articlesTotal]);

  useEffect(() => {
    filterArticlesByFavorites();
    setIsProfileSelected("profile");
  }, []);

  return (
    <section className="saved-news">
      <Navigation
        onLoginClick={onLoginClick}
        setIsProfileSelected={setIsProfileSelected}
        onEditProfileClick={onEditProfileClick}
        onLogoutClick={onLogoutClick}
        isProfileSelected={isProfileSelected}
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
            setLoading={setLoading}
            allArticles={filteredArticles}
            isSubmitted={isSubmitted}
            onArticleLike={onArticleLike}
            onArticleFavorite={onArticleFavorite}
            isProfileSelected={isProfileSelected}
            onRegistrationClick={onRegistrationClick}
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
