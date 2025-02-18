import "./RegistrationModal.css";

import ModalWithForm from "../ModalWithForm/ModalWithForm.jsx";

import { useFormAndValidation } from "../../Hooks/UseFormAndValidation.js";

export default function RegistrationModal({
  onSignUpUser,
  onCloseClick,
  isOpened,
  onLoginClick,
  onLoginUser,
  onLoginResponseInfo,
  onIsPasswordValid,
}) {
  const initialValues = {
    email: "",
    password: "",
    name: "",
    avatar: "",
  };

  const { values, handleChange, errors, isValid, resetForm } =
    useFormAndValidation(initialValues);

  const handleSubmit = (evt) => {
    evt.preventDefault();

    onSignUpUser(values)
      .then(() => {
        const userEmail = values.email;
        const userPassword = values.password;

        onLoginUser({ email: userEmail, password: userPassword })
          .then(() => {
            onLoginResponseInfo();
            resetForm();
            onCloseClick();
            onIsPasswordValid(true);
          })
          .catch((error) => {
            setErrorMessage("Login failed", error);
            onIsPasswordValid(false);
          });
      })
      .catch((error) => console.error("Registration failed", error));
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
        Email*
        <input
          name="email"
          type="email"
          className="modal__input modal__input_email"
          id="emailRegistration"
          placeholder="Email"
          value={values.email || ""}
          onChange={handleChange}
          required
        />
        <p className={`validation__email-message`}>{errors?.email}</p>
      </label>
      <label htmlFor="passwordRegistration" className="modal__label">
        Password*
        <input
          name="password"
          type="password"
          className="modal__input modal__input_image"
          id="passwordRegistration"
          placeholder="Password"
          value={values.password || ""}
          onChange={handleChange}
          required
        />
        <p className={`validation__password-message`}>{errors?.password}</p>
      </label>
      <label htmlFor="nameRegistration" className="modal__label">
        Name*
        <input
          name="name"
          type="text"
          className="modal__input modal__input_name"
          id="nameRegistration"
          placeholder="Name"
          value={values.name || ""}
          onChange={handleChange}
          required
        />
        <p className={`validation__name-message`}>{errors?.name}</p>
      </label>
      <label htmlFor="imageUrlRegistration" className="modal__label">
        Avatar URL*
        <input
          name="avatar"
          type="URL"
          className="modal__input modal__input_image"
          id="imageUrlRegistration"
          placeholder="Avatar URL"
          value={values.avatar || ""}
          onChange={handleChange}
        />
        <p className={`validation__url-message`}>{errors?.link}</p>
      </label>
    </ModalWithForm>
  );
}
