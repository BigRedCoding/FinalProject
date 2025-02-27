import "./NewsCard.css";

import { useState, useEffect, useContext } from "react";

import CurrentUserContext from "../../contexts/CurrentUserContext";

export default function NewsCard({ data, onArticleLike, onArticleFavorite }) {
  const {
    isLoggedIn,
    userData,
    isProfileSelected,
    articlesFavorited,
    articlesLiked,
  } = useContext(CurrentUserContext);

  const [currentLikes, setCurrentLikes] = useState("");
  const [currentFavorites, setCurrentFavorites] = useState([]);
  const [isLiked, setIsLiked] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  const compareArticles = () => {
    // Pull values into their own consts
    const likedArticle =
      articlesLiked.length > 0
        ? articlesLiked?.find(
            (item) =>
              item.author === data?.author &&
              item.title === data?.title &&
              item.imageUrl === data?.imageUrl &&
              item.url === data?.url &&
              item.source === data?.source &&
              item.date === data?.date
          )
        : "";

    const favoritedArticle =
      articlesFavorited.length > 0
        ? articlesFavorited?.find(
            (item) =>
              item.author === data?.author &&
              item.title === data?.title &&
              item.imageUrl === data?.imageUrl &&
              item.url === data?.url &&
              item.source === data?.source &&
              item.date === data?.date
          )
        : "";

    if (likedArticle) {
      setCurrentLikes(likedArticle.likes.length);
    } else if (favoritedArticle) {
      setCurrentLikes(favoritedArticle.likes.length);
    } else {
      setCurrentLikes(0);
    }
  };

  const checkUserStatus = () => {
    const userId = userData?.userId;

    // Ensure that articlesLiked and articlesFavorited are valid before accessing their properties
    const likedArticle =
      articlesLiked.length > 0
        ? articlesLiked?.find((item) => item?.likes?.includes(userId))
        : "";
    const favoritedArticle =
      articlesFavorited.length > 0
        ? articlesFavorited?.find((item) => item?.favorites?.includes(userId))
        : "";

    setIsLiked(!!likedArticle);
    setIsFavorited(!!favoritedArticle);

    compareArticles();
  };

  function formatTimestamp(timestamp) {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const date = new Date(timestamp);
    return date?.toLocaleDateString("en-US", options) || "";
  }

  const newAuthor = data?.author || "Unknown Author";
  const newTitle = data?.title || "No Title Available";
  const newDescription = data?.description || "No Description Available";
  const newImageUrl = data?.imageUrl || "https://via.placeholder.com/150";
  const newUrl = data?.url || "#";
  const newDate = formatTimestamp(data?.date || Date.now());
  const newSource = data?.source ? data.source.toUpperCase() : "UNKNOWN";

  const openCardLink = () => window.open(newUrl, "_blank");

  const handleArticleLike = () => {
    setIsLiked(!isLiked);
    if (isLiked === true) {
      setCurrentLikes((prevLikes) => prevLikes + 1);
    } else {
      setCurrentLikes((prevLikes) => prevLikes - 1);
    }

    onArticleLike(isLiked, {
      author: newAuthor,
      title: newTitle,
      description: newDescription,
      imageUrl: newImageUrl,
      url: newUrl,
      source: newSource,
      date: newDate,
      favorites: currentFavorites,
      likes: currentLikes,
    });
  };

  const handleArticleFavorite = () => {
    setIsFavorited(!isFavorited);
    onArticleFavorite(currentFavorites, {
      author: newAuthor,
      title: newTitle,
      description: newDescription,
      imageUrl: newImageUrl,
      url: newUrl,
      source: newSource,
      date: newDate,
      favorites: currentFavorites,
      likes: currentLikes,
    });
  };

  useEffect(() => {
    checkUserStatus();
  }, [data, userData]);

  return (
    <div className="newscard">
      <div className="newscard__header-menu">
        {isLoggedIn === true && !isProfileSelected ? (
          <>
            <button
              onClick={handleArticleFavorite}
              className="newscard__favorite-button"
            ></button>
            <div className="newscard__like-container">
              <p className="newscard__like-count">{currentLikes}</p>
              <button
                onClick={handleArticleLike}
                className="newscard__like-button"
              ></button>
            </div>
          </>
        ) : (
          <></>
        )}
        {isLoggedIn === true && isProfileSelected ? (
          <>
            <button className="newscard__keywords-button">keywords</button>
            <div className="newscard__like-container">
              <p className="newscard__like-count">{currentLikes}</p>
              <button
                onClick={handleArticleLike}
                className="newscard__like-button"
              ></button>
            </div>
            <button
              onClick={onArticleFavorite}
              className="newscard__remove-button"
            >
              remove
            </button>
          </>
        ) : (
          <></>
        )}
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
    </div>
  );
}
