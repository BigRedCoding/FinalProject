import "./LikedByServer.css";
import { useEffect, useState } from "react";

import Navigation from "../Navigation/Navigation";
import NewsSection from "../NewsSection/NewsSection";

export default function LikedByServer({
  onLoginClick,
  setNavigationSelection,
  onEditProfileClick,
  onLogoutClick,
  navigationSelection,
  onArticleLike,
  onArticleFavorite,
  articlesTotal,
  onRegistrationClick,
  likedByQuery,
  setLikedByQuery,
  mainPageSelection,
  setMainPageSelection,
  likedBySelection,
  setLikedBySelection,
  profileSelection,
  setProfileSelection,
}) {
  const [initialTrigger, setInitialTrigger] = useState(false);

  const [query, setQuery] = useState("");
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [loading, setLoading] = useState(false);

  const [placeholderDefault, setPlaceHolderDefault] = useState("Enter topic");

  const [noResultsText, setNoResultsText] = useState(
    "No liked articles! Be the first to like an article!"
  );
  const [isSubmitted, setIsSubmitted] = useState(true);

  const failedSearch = false;

  const handleChange = (e) => {
    const inputValue = e.target.value;

    setQuery(inputValue);
    if (inputValue.length < 1) {
      setPlaceHolderDefault("Please enter a keyword");
    }
  };

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

  const filterArticlesByLikes = () => {
    setFilteredArticles(
      articlesTotal.filter((article) => article.likes.length > 0)
    );
  };

  const handleSearch = (evt) => {
    evt.preventDefault();
    if (query.length < 1) {
      setPlaceHolderDefault("Please enter a keyword");
      return;
    }
    const searchWords = query.toLowerCase().split(" ").filter(Boolean);
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
    setLikedByQuery(query);
  };

  useEffect(() => {
    if (query.length < 1) {
      filterArticlesByLikes();
    }
  }, [query]);

  useEffect(() => {
    if (likedByQuery.length > 0) {
      setQuery(likedByQuery);
    }
  }, [navigationSelection]);

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
        setNavigationSelection("likedbyserver");
      }
    }
  }, []);

  return (
    <section className="liked-by-server">
      <Navigation
        onLoginClick={onLoginClick}
        setNavigationSelection={setNavigationSelection}
        onEditProfileClick={onEditProfileClick}
        onLogoutClick={onLogoutClick}
        navigationSelection={navigationSelection}
      />
      <div className="liked-by-server__header">
        <p className="liked-by-server__title">
          Items liked by users on the server
        </p>
        <p className="liked-by-server__keywords-text">
          By keywords:
          <span className="liked-by-server__span">{keywordsPhase}</span>
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
              placeholder={placeholderDefault}
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
                placeholder={placeholderDefault}
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
            allArticles={filteredArticles}
            isSubmitted={isSubmitted}
            onArticleLike={onArticleLike}
            onArticleFavorite={onArticleFavorite}
            navigationSelection={navigationSelection}
            onRegistrationClick={onRegistrationClick}
            failedSearch={failedSearch}
            mainPageSelection={mainPageSelection}
            setMainPageSelection={setMainPageSelection}
            likedBySelection={likedBySelection}
            setLikedBySelection={setLikedBySelection}
            profileSelection={profileSelection}
            setProfileSelection={setProfileSelection}
          />
        ) : (
          <p className="liked-by-server__no-articles">{noResultsText}</p>
        )}
      </div>
    </section>
  );
}
