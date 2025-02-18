import "./ToggleSwitch.css";
import { useContext } from "react";
import CurrentTemperatureUnitContext from "../../contexts/CurrentTemperatureUnitContext.js";

export default function ToggleSwitch() {
  const { handleToggleSwitchChange, currentTemperatureUnit } = useContext(
    CurrentTemperatureUnitContext
  );

  return (
    <label className="toggle">
      <input
        type="checkbox"
        className="toggle__checkbox"
        onClick={handleToggleSwitchChange}
      />
      <span className="toggle__circle"></span>
      <span
        className={`toggle__text toggle__text-f ${
          currentTemperatureUnit === "F" ? `toggle__text_color_white` : ``
        }`}
      >
        F
      </span>
      <span
        className={`toggle__text toggle__text-c ${
          currentTemperatureUnit === "C" ? `toggle__text_color_white` : ``
        }`}
      >
        C
      </span>
    </label>
  );
}
