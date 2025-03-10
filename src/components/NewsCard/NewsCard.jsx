import "./NewsCard.css";
import LikeImage from "../../assets/Heart.svg";
import NewsExplorerLogo from "../../assets/newsexplorerlogo.jpg";

import { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import CurrentUserContext from "../../contexts/CurrentUserContext";

export default function NewsCard({
  data,
  onArticleLike,
  onArticleFavorite,
  onRegistrationClick,
  navigationSelection,
}) {
  const { isLoggedIn, userData } = useContext(CurrentUserContext);

  const [currentLikes, setCurrentLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  const location = useLocation();

  const isSavedNews = location.pathname === "/saved-news";

  const newAuthor = data.author
    ? data.author
    : data.source
    ? data.source
    : "Unknown Author";

  const newTitle = data?.title || "No Title Available";
  const newDescription = data?.description || "No Description Available";
  const newImageUrl = data?.imageUrl || NewsExplorerLogo;
  const newUrl = data?.url || "#";

  const dateNow = Date.now();

  const datePulled = data?.date
    ? typeof data?.date === "string"
      ? Number(data?.date)
      : data?.date
    : dateNow;

  const timestamp = datePulled.length === 10 ? datePulled * 1000 : datePulled;

  const newDate = new Date(timestamp);

  const formattedDate = newDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const newSource = data?.source?.toUpperCase() || "UNKNOWN";

  const likeState = isLiked ? "newscard_button-liked" : "";
  const favoriteState = isFavorited ? "newscard_button-favorited" : "";

  const getRandomKeyword = () => {
    if (data?.keywords) {
      const keywords = data.keywords;
      const randomIndex = Math.floor(Math.random() * keywords.length);
      return keywords[randomIndex];
    }

    const blank = "";
    return blank;
  };

  const capitalizeFirstLetter = (keyword) => {
    if (keyword !== "") {
      return keyword?.charAt(0).toUpperCase() + keyword?.slice(1);
    }

    const blank = "";
    return blank;
  };

  const newKeywords = capitalizeFirstLetter(getRandomKeyword());

  const keywordsMod = navigationSelection === "home" ? "isHidden" : "";

  const openCardLink = () => window.open(newUrl, "_blank");

  const handleArticleLike = () => {
    const likeCount = isLiked ? currentLikes - 1 : currentLikes + 1;

    setIsLiked(!isLiked);
    setCurrentLikes(likeCount);
    onArticleLike(isLiked, data);
  };

  const handleArticleFavorite = () => {
    setIsFavorited(!isFavorited);
    onArticleFavorite(isFavorited, data);
  };

  const openRegistration = () => {
    onRegistrationClick();
  };
  useEffect(() => {
    setCurrentLikes(data?.likes?.length || 0);
    setIsLiked(data?.likes?.some((item) => item === userData?.userId) || false);
    setIsFavorited(
      data?.favorites?.some((item) => item === userData?.userId) || false
    );
  }, [userData]);

  useEffect(() => {
    if (data?.length > 0) {
      setCurrentLikes(data?.likes?.length || 0);
      setIsLiked(
        data?.likes?.some((item) => item === userData?.userId) || false
      );
      setIsFavorited(
        data?.favorites?.some((item) => item === userData?.userId) || false
      );
    }
  }, [data]);

  return (
    <li className="newscard">
      <div className="newscard__header-menu">
        {newKeywords.length > 0 && (
          <button
            type="button"
            className={`newscard__keywords-button ${keywordsMod}`}
          >
            {newKeywords}
          </button>
        )}
        <div className="newscard__favorite-container">
          {!isLoggedIn && (
            <>
              <button
                type="button"
                onClick={openRegistration}
                alt="Favorite image"
                className="newscard__favorite-image"
              >
                <div className="newscard__login-to-save">
                  <p className="newscard__lts-text">Sign in to save articles</p>
                </div>
              </button>
            </>
          )}
          {isLoggedIn && (
            <button
              type="button"
              onClick={handleArticleFavorite}
              className={`newscard__favorite-button ${favoriteState}`}
            >
              {isFavorited && (
                <div className="newscard__remove-from-save">
                  <p className="newscard__rfs-text">Remove from saved</p>
                </div>
              )}
            </button>
          )}

          {isLoggedIn && isFavorited && isSavedNews && (
            <>
              <button
                type="button"
                onClick={handleArticleFavorite}
                className="newscard__remove-button"
              >
                <div className="newscard__remove-from-save">
                  <p className="newscard__rfs-text">Remove from saved</p>
                </div>
              </button>
            </>
          )}
        </div>
      </div>
      <div className="newscard__like-container">
        <p className="newscard__like-count">{currentLikes}</p>
        {isLoggedIn && (
          <button
            type="button"
            onClick={handleArticleLike}
            className={`newscard__like-button ${likeState}`}
          ></button>
        )}
        <img
          src={LikeImage}
          alt="Like image"
          className="newscard__like-image"
        />
      </div>
      <div className="newscard__details-container">
        <img
          src={newImageUrl}
          alt="Image for article"
          className="newscard__image"
        />
        <div className="newscard__text-container">
          <p className="newscard__date">{formattedDate}</p>
          <p className="newscard__title">{newTitle}</p>
          <p className="newscard__author">Author: {newAuthor}</p>
          <p className="newscard__summary">{newDescription}</p>
          <div className="newscard__source-container">
            <p className="newscard__source">{newSource}</p>
            <button
              type="button"
              className="newscard__url"
              onClick={openCardLink}
            >
              Open Website
            </button>
          </div>
        </div>
      </div>
    </li>
  );
}
