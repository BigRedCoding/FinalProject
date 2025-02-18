import "./EditProfileModal.css";

import { useEffect, useContext } from "react";

import ModalWithForm from "../ModalWithForm/ModalWithForm.jsx";

import CurrentUserContext from "../../contexts/CurrentUserContext.js";

import { useFormAndValidation } from "../../Hooks/UseFormAndValidation.js";

export default function EditProfileModal({
  onCloseClick,
  isOpened,
  onUpdateProfileInfo,
}) {
  const { userData } = useContext(CurrentUserContext);

  const initialValues = {
    name: userData?.userName || "",
    avatar: userData?.userAvatar || "",
  };

  const { values, handleChange, errors, isValid, resetForm, setValues } =
    useFormAndValidation(initialValues);

  useEffect(() => {
    resetForm();
  }, [isOpened]);

  const handleSubmit = (evt) => {
    evt.preventDefault();
    onUpdateProfileInfo(values);
  };

  const handleOpenSignup = () => {
    isSignInOpen();
  };

  useEffect(() => {
    setValues(initialValues);
  }, [isOpened]);

  return (
    <ModalWithForm
      title="Change profile data"
      buttonText="Save changes "
      onCloseClick={onCloseClick}
      isSubmitVisible={isValid}
      onSubmit={handleSubmit}
      isOpened={isOpened}
      onOpenSignup={handleOpenSignup}
    >
      <label htmlFor="nameEditProfile" className="modal__label">
        Name*
        <input
          name="name"
          type="text"
          className="modal__input modal__input_name"
          id="nameEditProfile"
          placeholder="Name"
          value={values.name || ""}
          onChange={handleChange}
          required
        />
        <p className={`validation__name-message`}>{errors?.name}</p>
      </label>

      <label htmlFor="imageUrlEditProfile" className="modal__label">
        Avatar URL*
        <input
          name="avatar"
          type="URL"
          className="modal__input modal__input_image"
          id="imageUrlEditProfile"
          placeholder="Avatar URL"
          value={values.avatar || ""}
          onChange={handleChange}
        />
        <p className={`validation__url-message`}>{errors?.link}</p>
      </label>
    </ModalWithForm>
  );
}
