import "./ItemModal.css";
import AvatarImage from "../../assets/Avatar.svg";
import { useContext } from "react";

import CurrentUserContext from "../../contexts/CurrentUserContext.js";

function ItemModal({ selectedCard, onCloseClick, isOpened, onDeleteClick }) {
  const { userData } = useContext(CurrentUserContext);

  const cardId = selectedCard._id;

  const triggerDelete = () => {
    onDeleteClick(cardId);
  };

  const imageUrl =
    selectedCard?.link && typeof selectedCard?.link === "string"
      ? selectedCard.link
      : AvatarImage;

  const isOwn = selectedCard.owner === userData?.userId || "";

  const itemDeleteButtonClassName = `modal__delete-button ${
    isOwn ? "" : "modal__delete-button_hidden"
  }`;

  return (
    <div className={`modal ${isOpened}`}>
      <div className="modal__content modal__content_type-image">
        <button
          onClick={onCloseClick}
          type="button"
          className="modal__close-preview"
        ></button>
        <img
          src={imageUrl}
          alt={selectedCard?.name || "Default"}
          className="modal__image"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = AvatarImage;
          }}
        />
        <div className="modal__footer">
          <div className="modal__footer-details">
            <p className="modal__caption">{selectedCard.name}</p>
            <p className="modal__weather">Weather: {selectedCard.weather}</p>
          </div>
          <button
            className={`modal__delete-item-button ${itemDeleteButtonClassName}`}
            onClick={triggerDelete}
          >
            Delete Item
          </button>
        </div>
      </div>
    </div>
  );
}
export default ItemModal;
