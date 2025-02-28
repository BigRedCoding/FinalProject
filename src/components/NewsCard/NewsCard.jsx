import "./NewsCard.css";
import LikeImage from "../../assets/Heart.svg";

import { useState, useEffect, useContext } from "react";
import CurrentUserContext from "../../contexts/CurrentUserContext";

export default function NewsCard({
  data,
  onArticleLike,
  onArticleFavorite,
  setTrigger,
  trigger,
  triggerUpdateResults,
  articlesLiked,
  articlesFavorited,
}) {
  const { isLoggedIn, userData, isProfileSelected } =
    useContext(CurrentUserContext);

  const [initialLoad, setInitialLoad] = useState(false);
  const [cardData, setCardData] = useState({});
  const [currentLikes, setCurrentLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  const newAuthor = cardData?.author || "Unknown Author";
  const newTitle = cardData?.title || "No Title Available";
  const newDescription = cardData?.description || "No Description Available";
  const newImageUrl = cardData?.imageUrl || "";
  const newUrl = cardData?.url || "#";
  const newDate = new Date(cardData?.date || Date.now()).toLocaleDateString(
    "en-US",
    { year: "numeric", month: "long", day: "numeric" }
  );
  const newSource = cardData?.source?.toUpperCase() || "UNKNOWN";

  let newLikesLength = cardData?.likes?.length || 0;
  let newLikesCheck =
    Array.isArray(cardData?.likes) && cardData?.likes.includes(userData.userId);
  let newFavoritesCheck =
    Array.isArray(cardData?.favorites) &&
    cardData?.favorites.includes(userData.userId);

  const openCardLink = () => window.open(newUrl, "_blank");

  const handleArticleLike = () => {
    setCurrentLikes((prevLikes) => (isLiked ? prevLikes - 1 : prevLikes + 1));
    setIsLiked(!isLiked);

    onArticleLike(isLiked, cardData);
    setTrigger(!trigger);
    triggerUpdateResults();
  };

  const handleArticleFavorite = () => {
    setIsFavorited(!isFavorited);

    onArticleFavorite(isFavorited, cardData);
    setTrigger(!trigger);
    triggerUpdateResults();
  };

  const updateCardData = () => {
    if (!Array.isArray(articlesLiked) || !Array.isArray(articlesFavorited))
      return;

    const articleMatchCriteria = (article) =>
      article.author === data.author &&
      article.title === data.title &&
      article.imageUrl === data.imageUrl &&
      article.url === data.url &&
      article.source === data.source &&
      article.date === data.date;

    const getFilteredArticleData = (articles) => {
      return articles.find((article) => {
        if (articleMatchCriteria(article)) {
          const isLiked = article.likes?.includes(userData.userId);
          const isFavorited = article.favorites?.includes(userData.userId);

          if (isLiked && isFavorited) {
            return true; // Both likes and favorites contain the userId
          } else if (isLiked || isFavorited) {
            return true; // One of the fields contains the userId
          }
        }
        return false;
      });
    };

    const articleData = getFilteredArticleData([
      ...articlesLiked,
      ...articlesFavorited,
    ]);
    if (articleData) {
      setCardData(articleData);
    }
  };

  useEffect(() => {
    if (data) {
      setCardData(data);
      setInitialLoad(true);
    }
  }, [data, trigger]);

  useEffect(() => {
    if (initialLoad) {
      updateCardData();
    }
  }, [articlesLiked, articlesFavorited, initialLoad]);

  useEffect(() => {
    setIsLiked(newLikesCheck);
    setIsFavorited(newFavoritesCheck);
    setCurrentLikes(newLikesLength);
  }, [cardData]);

  return (
    <li className="newscard">
      <div className="newscard__header-menu">
        {isLoggedIn &&
          (isProfileSelected === "home" ||
            isProfileSelected === "likedbyserver") && (
            <>
              <button
                onClick={handleArticleFavorite}
                className="newscard__favorite-button"
              ></button>
              <div className="newscard__like-container">
                <p className="newscard__like-count">{currentLikes}</p>
                <button
                  onClick={handleArticleLike}
                  className={`newscard__like-button ${
                    isLiked ? "newscard_button-liked" : ""
                  }`}
                ></button>
              </div>
            </>
          )}
        {isLoggedIn && isProfileSelected === "profile" && (
          <>
            <button className="newscard__keywords-button">keywords</button>
            <div className="newscard__like-container">
              <p className="newscard__like-count">{newLikesLength}</p>
              <button
                onClick={handleArticleLike}
                className={`newscard__like-button ${
                  isLiked ? "newscard_button-liked" : ""
                }`}
              ></button>
            </div>
            <button
              onClick={handleArticleFavorite}
              className="newscard__remove-button"
            ></button>
          </>
        )}
        {isLoggedIn === false &&
        (isProfileSelected === "home" ||
          isProfileSelected === "likedbyserver") ? (
          <>
            <button className="newscard__keywords-button">keywords</button>
            <div className="newscard__like-container">
              <p className="newscard__like-count">{newLikesLength}</p>
              <img
                src={LikeImage}
                alt="Like image"
                className="newscard__like-image"
              />
            </div>
          </>
        ) : null}
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
