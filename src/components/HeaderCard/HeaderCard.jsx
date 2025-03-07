import "./HeaderCard.css";
import {
  weatherConditions,
  defaultWeatherOptions,
} from "../../utils/constants.js";
import { useContext, useEffect, useState, useRef } from "react";

import CurrentUserContext from "../../contexts/CurrentUserContext.js";

import { fetchAndDisplayData } from "../../utils/NewsApis/finnhub.js";

import StockCard from "../StockCard/StockCard.jsx";

export default function HeaderCard({ onOpenWeatherModal }) {
  const { weatherData } = useContext(CurrentUserContext);

  const scrollContainerRef = useRef(null);
  const stockContainer = useRef(null);
  const translateValue = useRef(0);

  let stockItems = [];
  const [stockItemsList, setStockItemsList] = useState(stockItems);

  const [initialTrigger, setInitialtrigger] = useState(false);

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

  const triggerOpenModal = () => {
    onOpenWeatherModal();
  };

  const callStockData = () => {
    fetchAndDisplayData().then((data) => {
      stockItems = [];
      if (data.length > 0) {
        for (let i = 0; i < data.length; i++) {
          const itemData = data[i];
          stockItems.push(<StockCard key={i} itemData={itemData} />);
        }
        setStockItemsList(stockItems);
      }
    });
  };

  useEffect(() => {
    let intervalId;
    let timeoutId;

    const startScrolling = () => {
      translateValue.current = 0;
      scrollContainerRef.current.style.transform = `translateX(${translateValue.current}px)`;
      if (timeoutId) clearTimeout(timeoutId);

      timeoutId = setTimeout(() => {
        if (intervalId) clearInterval(intervalId);

        intervalId = setInterval(() => {
          if (scrollContainerRef.current) {
            const listWidth = stockContainer.current.clientWidth;
            const containerWidth = scrollContainerRef.current.clientWidth;

            scrollContainerRef.current.style.transform = `translateX(${translateValue.current}px)`;

            translateValue.current -= 1;

            if (translateValue.current <= -1 * (containerWidth - listWidth)) {
              clearInterval(intervalId);
              clearTimeout(timeoutId);
              delay();
            }
          }
        }, 20);
      }, 2000);
    };

    const delay = () => {
      if (timeoutId) clearTimeout(timeoutId);

      timeoutId = setTimeout(() => {
        startScrolling();
      }, 2000);
    };

    startScrolling();

    return () => {
      if (intervalId) clearInterval(intervalId);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [stockItemsList]);

  useEffect(() => {
    if (initialTrigger === false) {
      setInitialtrigger(true);
      callStockData();

      const intervalId = setInterval(callStockData, 240000);

      return () => clearInterval(intervalId);
    }
  }, []);

  return (
    <section className="header-card">
      <div className="header-card__weather-card" onClick={triggerOpenModal}>
        <div className="header-card__wc-container">
          <p className="header-card__wc-temp">{weatherData.temp["F"]}°F</p>
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
      <div className="header-card__stock-container" ref={stockContainer}>
        <ul className="header-card__stock" ref={scrollContainerRef}>
          {stockItemsList}
        </ul>
      </div>
    </section>
  );
}
