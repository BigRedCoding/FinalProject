import "./RegistrationModal.css";

import ModalWithForm from "../ModalWithForm/ModalWithForm.jsx";

import { useFormAndValidation } from "../../Hooks/UseFormAndValidation.js";
import { useState } from "react";

export default function RegistrationModal({
  onSignUpUser,
  onCloseClick,
  isOpened,
  onLoginClick,
  onRegistrationCompleteClick,
}) {
  const initialValues = {
    email: "",
    password: "",
    name: "",
    avatar: "",
  };

  const [showError, setShowError] = useState(false);
  const [serverMessage, setServerMessage] = useState("");

  const { values, handleChange, errors, isValid, resetForm } =
    useFormAndValidation(initialValues);

  const handleSubmit = (evt) => {
    evt.preventDefault();

    onSignUpUser(values)
      .then(() => {
        onRegistrationCompleteClick();
        resetForm();
      })
      .catch((error) => {
        console.log(error);
        if (error === "Error: This email is not available") {
          let errorMessage = error;
          let cleanMessage = errorMessage.replace(/^Error: /, "");

          setShowError(true);
          setServerMessage(cleanMessage);
        }

        console.error("Registration failed", error);
      });
  };

  const handleOpenSignin = () => {
    onLoginClick();
  };

  return (
    <ModalWithForm
      title="Sign Up"
      buttonText="Sign Up"
      isSecondButtonVisible={true}
      buttonText2="Log In"
      onCloseClick={onCloseClick}
      isSubmitVisible={isValid}
      onSubmit={handleSubmit}
      isOpened={isOpened}
      onOpenSignup={handleOpenSignin}
    >
      <label htmlFor="emailRegistration" className="modal__label">
        Email
        <input
          name="email"
          type="email"
          className="modal__input modal__input_email"
          id="emailRegistration"
          placeholder="Enter email"
          value={values.email || ""}
          onChange={handleChange}
          required
        />
        <p className={`validation__email-message`}>{errors?.email}</p>
      </label>
      <label htmlFor="passwordRegistration" className="modal__label">
        Password
        <input
          name="password"
          type="password"
          className="modal__input modal__input_image"
          id="passwordRegistration"
          placeholder="Enter password"
          value={values.password || ""}
          onChange={handleChange}
          required
        />
        <p className={`validation__password-message`}>{errors?.password}</p>
      </label>
      <label htmlFor="nameRegistration" className="modal__label">
        Name
        <input
          name="name"
          type="text"
          className="modal__input modal__input_name"
          id="nameRegistration"
          placeholder="Enter name"
          value={values.name || ""}
          onChange={handleChange}
          required
        />
        <p className={`validation__name-message`}>{errors?.name}</p>
      </label>
      <label htmlFor="imageUrlRegistration" className="modal__label">
        Avatar URL
        <input
          name="avatar"
          type="URL"
          className="modal__input modal__input_image"
          id="imageUrlRegistration"
          placeholder="Avatar URL (Optional)"
          value={values.avatar || ""}
          onChange={handleChange}
        />
        <p className={`validation__url-message`}>{errors?.link}</p>
        {showError && (
          <p className="validation__url-message">{serverMessage}</p>
        )}
      </label>
    </ModalWithForm>
  );
}
