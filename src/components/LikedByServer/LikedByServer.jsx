import "./LikedByServer.css";
import { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import CurrentUserContext from "../../contexts/CurrentUserContext";
import Navigation from "../Navigation/Navigation";
import NewsSection from "../NewsSection/NewsSection";

export default function LikedByServer({
  onLoginClick,
  setIsProfileSelected,
  onEditProfileClick,
  onLogoutClick,
  isProfileSelected,
  onArticleLike,
  onArticleFavorite,
  onSetLikedArticles,
  articlesLiked,
  articlesFavorited,
  setTrigger,
  trigger,
}) {
  const [query, setQuery] = useState("");
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isArticlesFetched, setIsArticlesFetched] = useState(false);
  const location = useLocation();

  const handleSearch = (evt) => {
    evt.preventDefault();
    const searchWords = query.toLowerCase().split(" ");
    const filteredResults = articlesLiked.filter((article) =>
      searchWords.some((word) => article.title.toLowerCase().includes(word))
    );
    setFilteredArticles(filteredResults);
  };

  useEffect(() => {
    if (
      location.pathname === "/liked-by-server" &&
      isArticlesFetched === false
    ) {
      onSetLikedArticles();
    }
    setIsArticlesFetched(true);
    setIsProfileSelected("likedbyserver");
  }, [location.pathname]);

  useEffect(() => {
    if (articlesLiked) {
      setFilteredArticles(articlesLiked);
    }
  }, [articlesLiked, location.pathname]);

  return (
    <section className="liked-by-server">
      <Navigation
        onLoginClick={onLoginClick}
        setIsProfileSelected={setIsProfileSelected}
        onEditProfileClick={onEditProfileClick}
        onLogoutClick={onLogoutClick}
        isProfileSelected={isProfileSelected}
        setTrigger={setTrigger}
        trigger={trigger}
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
          <p className="liked-by-server__no-articles">No liked articles!</p>
        )}
      </div>
    </section>
  );
}
