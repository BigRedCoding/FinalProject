import React from "react";
import "./ModalWithForm.css";

function ModalWithForm({
  buttonText,
  isSecondButtonVisible,
  buttonText2,
  isSubmitVisible,
  title,
  onCloseClick,
  onSubmit,
  isOpened,
  onOpenSignup,
  children,
}) {
  return (
    <div className={`modal ${isOpened}`}>
      <div className="modal__content modal__content_form">
        <h2 className="modal__title">{title}</h2>
        <button onClick={onCloseClick} type="button" className="modal__close" />
        <form className="modal__form" name="name" onSubmit={onSubmit}>
          {children}
          <div className="modal__form-footer">
            <button
              type="submit"
              className="modal__submit"
              disabled={!isSubmitVisible}
            >
              {buttonText}
            </button>
            {isSecondButtonVisible && (
              <div className="modal__form-footer-additional">
                <p className="login__form-footer-text">or</p>
                <button
                  type="button"
                  className="modal__button"
                  onClick={onOpenSignup}
                >
                  {buttonText2}
                </button>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default ModalWithForm;
