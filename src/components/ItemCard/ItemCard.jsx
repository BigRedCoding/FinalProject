import "./ItemCard.css";
import { useState, useEffect, useContext } from "react";
import AvatarImage from "../../assets/Avatar.svg";
import LikeImage from "../../assets/Heart.svg";
import CurrentUserContext from "../../contexts/CurrentUserContext";

function ItemCard({ id, item, onCardClick, onCardLike }) {
  const { isLoggedIn, userData, clothingItems } =
    useContext(CurrentUserContext);

  let isLiked = item.likes.some((id) => id === userData?.userId);
  const cardKey = id;

  const [isCurrentlyLiked, setIsCurrentlyLiked] = useState(isLiked || false);

  const handleCardClick = () => {
    onCardClick(item);
  };

  const itemLikeButtonClassName = `card__like-button_is-liked`;

  const handleCardLikeState = () => {
    onCardLike(cardKey, isCurrentlyLiked);
  };

  useEffect(() => {
    const currentItem = clothingItems.find(
      (clothingItem) => clothingItem._id === id
    );
    if (currentItem) {
      isLiked = currentItem.likes.some(
        (cardKey) => cardKey === userData?.userId
      );
      setIsCurrentlyLiked(isLiked);
    }
  }, [clothingItems]);

  return (
    <li className="card">
      <div className="card__header">
        <h2 className="card__name">{item.name}</h2>
        {isLoggedIn ? (
          <button
            type="button"
            className={`card__like-button ${
              isCurrentlyLiked ? itemLikeButtonClassName : ""
            }`}
            src={LikeImage}
            alt="Like image"
            onClick={handleCardLikeState}
          ></button>
        ) : (
          <></>
        )}
      </div>
      <img
        onClick={handleCardClick}
        src={item?.link || AvatarImage}
        alt={item?.name || "default"}
        className="card__image"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = AvatarImage;
        }}
      />
    </li>
  );
}

export default ItemCard;
