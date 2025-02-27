import "./HeaderCard.css";
import {
  weatherConditions,
  defaultWeatherOptions,
} from "../../utils/constants.js";
import { useContext, useEffect, useState } from "react";
import CurrentTemperatureUnitContext from "../../contexts/CurrentTemperatureUnitContext.js";
import CurrentUserContext from "../../contexts/CurrentUserContext.js";

import { fetchAndDisplayData } from "../../utils/NewsApis/finnhub.js";

import StockCard from "../StockCard/StockCard.jsx";

export default function HeaderCard({ onOpenWeatherModal }) {
  const { currentTemperatureUnit } = useContext(CurrentTemperatureUnitContext);
  const { weatherData } = useContext(CurrentUserContext);

  const currentDate = new Date().toLocaleString("default", {
    month: "long",
    day: "numeric",
  });

  const filteredOptions = weatherConditions.filter((option) => {
    return (
      option.day === weatherData.isDay &&
      option.condition === weatherData.condition
    );
  });

  let weatherOption;

  if (filteredOptions.length === 0) {
    weatherOption = defaultWeatherOptions[weatherData.isDay ? "day" : "night"];
    weatherOption.condition = weatherData.condition;
  } else {
    weatherOption = filteredOptions[0];
  }

  let stockItems = [];
  const [stockItemsList, setStockItemsList] = useState(stockItems);

  const triggerOpenModal = () => {
    onOpenWeatherModal();
  };

  const callStockData = () => {
    fetchAndDisplayData().then((data) => {
      stockItems = [];
      for (let i = 0; i < data.length; i++) {
        const itemData = data[i];
        stockItems.push(<StockCard key={i} itemData={itemData} />);
      }
      setStockItemsList(stockItems);
    });
  };

  useEffect(() => {
    callStockData();

    const intervalId = setInterval(callStockData, 240000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <section className="header-card">
      <div className="header-card__weather-card" onClick={triggerOpenModal}>
        <div className="header-card__wc-container">
          <p className="header-card__wc-temp">
            {weatherData.temp[currentTemperatureUnit]}°{currentTemperatureUnit}
          </p>
          <p className="header-card__wc-date-location">
            {currentDate}, {weatherData.city}
          </p>
        </div>
        <img
          src={weatherOption?.url}
          alt={`Image showing ${weatherOption?.day ? "day" : "night"}time and ${
            weatherOption?.condition
          }`}
          className="header-card__weather-image"
        />
      </div>
      <ul className="header-card__stock">{stockItemsList}</ul>
    </section>
  );
}
