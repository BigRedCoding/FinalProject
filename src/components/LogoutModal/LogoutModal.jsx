import "./LogoutModal.css";

export default function LogoutModal({ isOpened, onLogout, onCloseClick }) {
  const triggerLogout = () => {
    onLogout();
    onCloseClick();
  };

  return (
    <div className={`logout-modal ${isOpened}`}>
      <div className="logout-modal__container">
        <button
          onClick={onCloseClick}
          className="logout-modal__close-button"
        ></button>
        <div className="logout-modal__details-container">
          <p className="logout-modal__text">
            Are you sure you would like to log out?
          </p>
          <div className="logout-modal__button-container">
            <button onClick={triggerLogout} className="logout-modal__button">
              Logout
            </button>
            <button onClick={onCloseClick} className="logout-modal__button">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
