import "./NewsCard.css";
import LikeImage from "../../assets/Heart.svg";

import { useState, useEffect, useContext } from "react";
import CurrentUserContext from "../../contexts/CurrentUserContext";

export default function NewsCard({ data, onArticleLike, onArticleFavorite }) {
  const { isLoggedIn, userData } = useContext(CurrentUserContext);

  const [currentLikes, setCurrentLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  const newAuthor = data?.author || "Unknown Author";
  const newTitle = data?.title || "No Title Available";
  const newDescription = data?.description || "No Description Available";
  const newImageUrl = data?.imageUrl || "";
  const newUrl = data?.url || "#";
  const newDate = new Date(data?.date || Date.now()).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  const newSource = data?.source?.toUpperCase() || "UNKNOWN";

  const likeState = isLiked ? "newscard_button-liked" : "";
  const favoriteState = isFavorited ? "newscard_button-favorited" : "";
  const newKeywords = data?.keywords || "";

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

  useEffect(() => {
    setCurrentLikes(data?.likes?.length || 0);
    setIsLiked(data?.likes?.some((item) => item === userData.userId) || false);
    setIsFavorited(
      data?.favorites?.some((item) => item === userData.userId) || false
    );
  }, [data]);

  return (
    <li className="newscard">
      <div className="newscard__header-menu">
        {newKeywords.length > 0 && (
          <button className="newscard__keywords-button">{newKeywords}</button>
        )}
        <div className="newscard__favorite-container">
          {!isLoggedIn && (
            <>
              <button alt="Favorite image" className="newscard__favorite-image">
                <div className="newscard__login-to-save">
                  <p className="newscard__lts-text">Sign in to save articles</p>
                </div>
              </button>
            </>
          )}
          {isLoggedIn && !isFavorited && (
            <>
              <button
                onClick={handleArticleFavorite}
                className={`newscard__favorite-button ${favoriteState}`}
              ></button>
            </>
          )}
          {isLoggedIn && isFavorited && (
            <>
              <button
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
          <p className="newscard__date">{newDate}</p>
          <p className="newscard__title">{newTitle}</p>
          <p className="newscard__author">Author: {newAuthor}</p>
          <p className="newscard__summary">{newDescription}</p>
          <div className="newscard__source-container">
            <p className="newscard__source">{newSource}</p>
            <button className="newscard__url" onClick={openCardLink}>
              Open Website
            </button>
          </div>
        </div>
      </div>
    </li>
  );
}
