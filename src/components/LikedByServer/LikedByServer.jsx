import "./LikedByServer.css";
import { useEffect, useState } from "react";

import Navigation from "../Navigation/Navigation";
import NewsSection from "../NewsSection/NewsSection";

export default function LikedByServer({
  onLoginClick,
  setIsProfileSelected,
  onEditProfileClick,
  onLogoutClick,
  isProfileSelected,
  articlesTotal,
  onArticleLike,
  onArticleFavorite,
}) {
  const [initialTrigger, setInitialTrigger] = useState(false);

  const [query, setQuery] = useState("");
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [loading, setLoading] = useState(false);

  const isSubmitted = true;

  const filterArticlesByLikes = () => {
    setFilteredArticles(
      articlesTotal.filter((article) => article.likes.length > 0)
    );
  };

  const handleSearch = (evt) => {
    evt.preventDefault();
    const searchWords = query.toLowerCase().split(" ");
    const filteredResults = articlesTotal.filter((article) =>
      searchWords.some((word) => article.title.toLowerCase().includes(word))
    );
    setFilteredArticles(filteredResults);
  };

  useEffect(() => {
    if (!initialTrigger) {
      if (articlesTotal?.length > 0) {
        filterArticlesByLikes();
        setInitialTrigger(true);
        setIsProfileSelected("likedbyserver");
      }
    }
  }, []);

  return (
    <section className="liked-by-server">
      <Navigation
        onLoginClick={onLoginClick}
        setIsProfileSelected={setIsProfileSelected}
        onEditProfileClick={onEditProfileClick}
        onLogoutClick={onLogoutClick}
        isProfileSelected={isProfileSelected}
      />
      <div className="liked-by-server__header">
        <p className="liked-by-server__title">
          List of items liked by other users
        </p>
        <div className="liked-by-server__form-container">
          <form className="liked-by-server__news-form" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search for articles"
              value={query}
              className="liked-by-server__news-input"
              onChange={(e) => setQuery(e.target.value)}
            />
            <button
              className="liked-by-server__news-submit-button"
              type="submit"
            >
              Search
            </button>
          </form>
        </div>
      </div>
      <div className="liked-by-server__saved-container">
        {filteredArticles.length > 0 ? (
          <NewsSection
            loading={loading}
            setLoading={setLoading}
            allArticles={articlesTotal}
            isSubmitted={isSubmitted}
            onArticleLike={onArticleLike}
            onArticleFavorite={onArticleFavorite}
            query={query}
          />
        ) : (
          <p className="liked-by-server__no-articles">No liked articles!</p>
        )}
      </div>
    </section>
  );
}
