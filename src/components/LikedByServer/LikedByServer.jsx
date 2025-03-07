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
  onArticleLike,
  onArticleFavorite,
  articlesTotal,
  onRegistrationClick,
}) {
  const [initialTrigger, setInitialTrigger] = useState(false);

  const [query, setQuery] = useState("");
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [loading, setLoading] = useState(false);

  const [placeholderDefault, setPlaceHolderDefault] = useState("Enter topic");

  const [noResultsText, setNoResultsText] = useState(
    "No liked articles! Be the first to like an article!"
  );

  const isSubmitted = true;

  const handleChange = (e) => {
    const inputValue = e.target.value;
    console.log(inputValue);
    setQuery(inputValue);
    if (inputValue.length < 1) {
      setPlaceHolderDefault("Please enter a keyword");
    }
  };

  const keywords =
    filteredArticles
      ?.filter((article) => article.keywords.length > 0)
      .map((article) => article.keywords.join(", "))
      .join(", ") || "no key words associated";

  const filterArticlesByLikes = () => {
    setFilteredArticles(
      articlesTotal.filter((article) => article.likes.length > 0)
    );
  };

  const handleSearch = (evt) => {
    evt.preventDefault();
    const searchWords = query.toLowerCase().split(" ");
    const filteredResults = filteredArticles.filter((article) => {
      return (
        searchWords.some((word) =>
          article.title.toLowerCase().includes(word)
        ) ||
        searchWords.some((word) =>
          article.description.toLowerCase().includes(word)
        ) ||
        searchWords.some((word) =>
          article.author.toLowerCase().includes(word)
        ) ||
        searchWords.some((word) => article.source.toLowerCase().includes(word))
      );
    });
    setFilteredArticles(filteredResults);
    if (filteredResults.length < 1) {
      setNoResultsText("No liked articles match your search");
    }
  };

  useEffect(() => {
    if (articlesTotal?.length >= 0) {
      filterArticlesByLikes();
    }
  }, [articlesTotal]);

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
          Items liked by users on the server
        </p>
        <p className="liked-by-server__keywords-text">
          By keywords: <span className="liked-by-server__span">{keywords}</span>
        </p>
        <div className="liked-by-server__form-container">
          <form
            id="search-primary-like"
            className="liked-by-server__news-form"
            onSubmit={handleSearch}
          >
            <input
              name="search-primary-like"
              type="text"
              placeholder="Enter topic"
              value={query}
              className="liked-by-server__news-input"
              onChange={(e) => handleChange(e)}
            />
            <button
              className="liked-by-server__news-submit-button"
              type="submit"
            >
              Search
            </button>
          </form>
        </div>
        <div className="liked-by-server__form-container-mobile">
          <div className="liked-by-server__form-inner">
            <form
              id="search-secondary-like"
              className="liked-by-server__news-form-mobile"
            >
              <input
                name="search-secondary-like"
                type="text"
                placeholder="Enter topic"
                value={query}
                className="liked-by-server__news-input-mobile"
                onChange={(e) => handleChange(e)}
              />
            </form>
            <button
              onClick={handleSearch}
              className="liked-by-server__submit-button-mobile"
              type="button"
            >
              Search
            </button>
          </div>
        </div>
      </div>
      <div className="liked-by-server__saved-container">
        {filteredArticles.length > 0 ? (
          <NewsSection
            loading={loading}
            setLoading={setLoading}
            allArticles={filteredArticles}
            isSubmitted={isSubmitted}
            onArticleLike={onArticleLike}
            onArticleFavorite={onArticleFavorite}
            query={query}
            isProfileSelected={isProfileSelected}
            onRegistrationClick={onRegistrationClick}
          />
        ) : (
          <p className="liked-by-server__no-articles">{noResultsText}</p>
        )}
      </div>
    </section>
  );
}
