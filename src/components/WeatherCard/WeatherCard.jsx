import "./WeatherCard.css";

import { weatherConditions2 } from "../../utils/constants.js";

import WaterDroplet from "../../assets/waterdroplet.png";

export default function ({ day, index }) {
  const date = day?.date || "";
  const precipitationProbability = day?.precipitation_probability || "";

  const temperatureMax = ((day?.temperature_max * 9) / 5 + 32).toFixed(0) || "";
  const temperatureMin = ((day?.temperature_min * 9) / 5 + 32).toFixed(0) || "";

  const weatherCode = day?.weather_code || 0;

  const filteredOption = weatherConditions2.filter((option) => {
    return option.code.includes(weatherCode);
  });

  const optionImage = filteredOption[0]?.url || "";
  const optionCondition = filteredOption[0]?.condition || "";

  function getDayOfWeek(dateStr) {
    const date = new Date(dateStr);
    const weekdays = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];
    const dayOfWeek = weekdays[date.getDay()];

    return dayOfWeek;
  }

  const dayOfWeek = getDayOfWeek(date);

  return (
    <li className={`weather-card ${index === 1 ? "highlight" : ""}`}>
      <img
        src={optionImage}
        alt={`Image showing ${optionCondition}`}
        className="weather-card__weather-image"
      />
      <div className="weather-card__precipitation-container">
        {" "}
        <p className="weather-card__text">{optionCondition}</p>
        <img
          src={WaterDroplet}
          alt="Water droplet"
          className="weather-card__precipitation-image"
        />
        <p> {precipitationProbability}%</p>
      </div>
      <div className="weather-card__temp-container">
        <p className="weather-card__temp-max">{temperatureMax}°F</p>
        <p className="weather-card__temp-min">{temperatureMin}°F</p>
      </div>
      <p className="weather-card__text weather-card__day">{dayOfWeek}</p>
    </li>
  );
}
