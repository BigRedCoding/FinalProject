import "./AddItemModal.css";
import { useEffect } from "react";

import ModalWithForm from "../ModalWithForm/ModalWithForm.jsx";

import { useFormAndValidation } from "../../Hooks/UseFormAndValidation.js";

export default function AddItemModal({
  onCloseClick,
  onAddItemModalSubmit,
  isOpened,
}) {
  const initialValues = {
    name: "",
    link: "",
    weatherType: "",
  };

  const { values, handleChange, errors, isValid, resetForm } =
    useFormAndValidation(initialValues);

  const handleSubmit = (evt) => {
    evt.preventDefault();
    onAddItemModalSubmit(values);
  };

  useEffect(() => {
    resetForm();
  }, [isOpened]);

  return (
    <ModalWithForm
      title="New garment"
      buttonText="Add garment"
      onCloseClick={onCloseClick}
      isSubmitVisible={isValid}
      onSubmit={handleSubmit}
      isOpened={isOpened}
    >
      <label htmlFor="nameAddItem" className="modal__label">
        Name
        <input
          name="name"
          type="text"
          className="modal__input modal__input_name"
          id="nameAddItem"
          placeholder="Name"
          value={values.name || ""}
          onChange={handleChange}
          required
        />
        <p className={`validation__name-message`}>{errors?.name}</p>
      </label>
      <label htmlFor="urlTextAddItem" className="modal__label">
        Image
        <input
          name="link"
          type="URL"
          className="modal__input modal__input_image"
          id="urlTextAddItem"
          placeholder="Image Url"
          value={values.link || ""}
          onChange={handleChange}
          required
        />
        <p className={`validation__url-message`}>{errors?.link}</p>
      </label>
      <fieldset
        className="modal__radio-buttons"
        onChange={handleChange}
        required
      >
        <legend className="modal__radio-legend">
          Select the weather type:
        </legend>
        <label htmlFor="hot">
          <input
            type="radio"
            name="weatherType"
            value="hot"
            id="hot"
            checked={values.weatherType === "hot"}
            onChange={handleChange}
            required
          />
          Hot
        </label>
        <label htmlFor="warm">
          <input
            type="radio"
            name="weatherType"
            value="warm"
            id="warm"
            checked={values.weatherType === "warm"}
            onChange={handleChange}
            required
          />
          Warm
        </label>
        <label htmlFor="cold">
          <input
            type="radio"
            name="weatherType"
            value="cold"
            id="cold"
            checked={values.weatherType === "cold"}
            onChange={handleChange}
            required
          />
          Cold
        </label>
        <p className={`validation__weather-message`}>{errors?.weatherType}</p>
      </fieldset>
    </ModalWithForm>
  );
}
