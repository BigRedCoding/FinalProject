import "./RegistrationCompleteModal.css";

export default function RegistrationCompleteModal({
  isOpened,
  onLoginClick,
  onCloseClick,
}) {
  return (
    <div className={`registration-complete ${isOpened}`}>
      <div className="registration-complete__container">
        <button
          type="button"
          className="registration-complete__close-button"
          onClick={onCloseClick}
        ></button>
        <div className="registration-complete__text-container">
          <p className="registration-complete__text">
            Registration successfully completed!
          </p>
          <button
            type="button"
            onClick={onLoginClick}
            className="registration-complete__sign-in-button"
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
}
