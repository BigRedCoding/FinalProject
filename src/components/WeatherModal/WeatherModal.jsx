import "./WeatherModal.css";
import {
  weatherConditions,
  defaultWeatherOptions,
} from "../../utils/constants.js";

import React, { useState, useEffect, useRef, useContext } from "react";

import WeatherCard from "../WeatherCard/WeatherCard";
import fetchWeatherData from "../../utils/NewsApis/otherweatherapi";

import CurrentUserContext from "../../contexts/CurrentUserContext.js";

import SunriseImage from "../../assets/sunrisewhite.png";
import SunsetImage from "../../assets/sunsetwhite.png";
import HumidityImage from "../../assets/humidity1.png";
import WindImage from "../../assets/wind1.png";
import PressureImage from "../../assets/pressurewhite.png";
import UvImage from "../../assets/uvwhite.png";

export default function WeatherModal({
  totalWeatherData,
  isOpened,
  onCloseClick,
  currentLocation,
}) {
  const { weatherData } = useContext(CurrentUserContext);

  const [daysData, setDaysData] = useState({});

  const { main, weather, wind, sys, name, timezone, dt } = totalWeatherData;

  const scrollContainerRef = useRef(null);
  const stockContainer = useRef(null);
  const translateValue = useRef(0);

  const [currentTime, setCurrentTime] = useState(
    new Date((dt + timezone) * 1000)
  );

  const currentDate = new Date();
  const date = currentDate?.toLocaleDateString() || "";
  const time = currentTime?.toLocaleTimeString() || "";
  const dayOfWeek =
    currentDate?.toLocaleString("en-us", { weekday: "long" }) || "";
  const location = name || "";
  const temperature = main?.temp || "";
  const feelsLike = main?.temp || "";
  const condition = weather ? weather[0].description : "";
  const windSpeed = wind ? (wind.speed * 2.23694).toFixed(2) : "";
  const pressure = main?.pressure || "";
  const uvExposure = daysData[0]?.shortwave_radiation_sum || "";
  const humidity = main?.humidity || "";

  const sunrise = sys
    ? new Date(sys.sunrise * 1000).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    : "";
  const sunset = sys
    ? new Date(sys.sunset * 1000).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    : "";

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
  }, [daysData]);

  useEffect(() => {
    if (currentLocation.latitude && currentLocation.longitude) {
      fetchWeatherData(currentLocation).then((data) => {
        const daysData = data.daysData;
        setDaysData(daysData);
      });
    }
  }, [isOpened]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`weather-modal ${isOpened}`}>
      <div className="weather-modal__weather-breakdown">
        <button
          type="button"
          className="weather-modal__close-button"
          onClick={onCloseClick}
        ></button>
        <div className="weather-modal__all-container">
          <div className="weather-modal__current-container">
            <div className="weather-modal__location-container">
              <p className="weather-modal__location">{location}</p>
              <div className="weather-modal__temporal-container">
                <p className="weather-modal__time">{time}</p>
                <div className="weather-modal__day-time-container">
                  <p className="weather-modal__day-of-week">{dayOfWeek}</p>
                  <p className="weather-modal__date">{date}</p>
                </div>
              </div>
            </div>
            <div className="weather-modal__temp-image-container">
              <div className="weather-modal__container-header">
                <div className="weather-modal__temp--srss-container">
                  <div className="weather-modal__temp">
                    <p className="weather-modal__temp-text">Actual:</p>
                    <p className="weather-modal__temperature">
                      {temperature}°F
                    </p>
                    <p className="weather-modal__temp-text">Feels like:</p>
                    <p className="weather-modal__temperature">{feelsLike}°F</p>
                  </div>
                </div>
                <div className="weather-modal__image-container">
                  <img
                    src={weatherOption?.url}
                    alt={`Image showing ${
                      weatherOption?.day ? "day" : "night"
                    }time and ${weatherOption?.condition}`}
                    className="weather-modal__conditions-image"
                  />
                  <p className="weather-modal__conditions">{condition}</p>
                </div>
              </div>
              <div className="weather-modal__sunrise-sunset">
                <div className="weather-modal__sunrise-container">
                  <img
                    src={SunriseImage}
                    alt="Sunrise Image"
                    className="weather-modal__sunrise-image"
                  />
                  <div className="weather-modal__sunrise-text-container">
                    <p className="weather-modal__sunrise">Sunrise:</p>
                    <p className="weather-modal__sunrise">{sunrise}</p>
                  </div>
                </div>
                <div className="weather-modal__sunset-container">
                  <img
                    src={SunsetImage}
                    alt="Sunset Image"
                    className="weather-modal__sunset-image"
                  />
                  <div className="weather-modal__sunset-text-container">
                    <p className="weather-modal__sunset-text">Sunset:</p>
                    <p className="weather-modal__sunset-text"> {sunset}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="weather-modal__current-conditions">
            <div className="weather-modal__condition-container">
              <img
                src={HumidityImage}
                alt="Humidity Image"
                className="weather-modal__condition-image"
              />
              <p className="weather-modal__condition">{humidity}%</p>
              <p className="weather-modal__condition">Humidity</p>
            </div>

            <div className="weather-modal__condition-container">
              <img
                src={WindImage}
                alt="Wind Image"
                className="weather-modal__condition-image"
              />
              <p className="weather-modal__condition">{windSpeed} mph</p>
              <p className="weather-modal__condition">Wind Speed</p>
            </div>
            <div className="weather-modal__condition-container">
              <img
                src={PressureImage}
                alt="Pressure Image"
                className="weather-modal__condition-image"
              />
              <p className="weather-modal__condition">{pressure}hPa</p>
              <p className="weather-modal__condition">pressure</p>
            </div>
            <div className="weather-modal__condition-container">
              <img
                src={UvImage}
                alt="UV Image"
                className="weather-modal__condition-image"
              />
              <p className="weather-modal__condition">{uvExposure}%</p>
              <p className="weather-modal__condition">UV</p>
            </div>
          </div>
          <div className="weather-modal__weather-container">
            <h3 className="weather-modal__forecast-text">Forecast</h3>
            <div
              className="weather-modal__weather-list-container"
              ref={stockContainer}
            >
              <ul
                className="weather-modal__forecast-list"
                ref={scrollContainerRef}
              >
                {daysData.length > 0 ? (
                  daysData.map((day, index) => (
                    <WeatherCard day={day} key={index} index={index} />
                  ))
                ) : (
                  <div>No forecast data available</div>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
