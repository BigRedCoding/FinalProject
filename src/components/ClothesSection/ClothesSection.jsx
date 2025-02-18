import "./ClothesSection.css";

import { useContext, useEffect } from "react";

import ItemCard from "../ItemCard/ItemCard.jsx";

import CurrentUserContext from "../../contexts/CurrentUserContext.js";

export default function ClothesSection({
  onCardClick,
  clothingItems,
  onAddClick,
  onCardLike,
}) {
  const { isLoggedIn, userData } = useContext(CurrentUserContext);

  const filteredItems = isLoggedIn
    ? clothingItems.filter((item) => item.owner === userData.userId)
    : [];

  const itemCards = [];

  for (let i = 0; i < filteredItems.length; i++) {
    if (itemCards.length !== filteredItems.length) {
      const item = filteredItems[i];
      itemCards.push(
        <ItemCard
          key={i}
          id={item._id}
          item={item}
          onCardClick={onCardClick}
          onCardLike={onCardLike}
        />
      );
    }
  }

  // for (let i = filteredItems.length - 1; i >= 0; i--) {
  //   const item = filteredItems[i];
  //   itemCards.push(
  //     <ItemCard
  //       key={i}
  //       id={item._id}
  //       item={item}
  //       onCardClick={onCardClick}
  //       onCardLike={onCardLike}
  //     />
  //   );
  // }

  return (
    <div className="clothes">
      <div className="clothes__header">
        <p className="clothes__text">Your items</p>
        <button className="clothes__button" onClick={onAddClick}>
          <p className="clothes__button-text">+Add New</p>
        </button>
      </div>
      <ul className="cards__list clothes__list">{itemCards}</ul>
    </div>
  );
}
