import "./Main.css";
import WeatherCard from "../WeatherCard/WeatherCard";
import ItemCard from "../ItemCard/ItemCard.jsx";
import randomizeImage from "../../assets/randomizeImage.svg";
import { useContext } from "react";
import CurrentTemperatureUnitContext from "../../contexts/CurrentTemperatureUnitContext.js";
import CurrentUserContext from "../../contexts/CurrentUserContext.js";

export default function Main({ onCardClick, onCardLike }) {
  const { currentTemperatureUnit } = useContext(CurrentTemperatureUnitContext);
  const { clothingItems, weatherData } = useContext(CurrentUserContext);

  const sortedItems = clothingItems.filter(
    (item) => item.weather === weatherData.type
  );

  let itemCards = [];

  for (let i = 0; i < sortedItems.length; i++) {
    if (itemCards.length !== sortedItems.length) {
      const item = sortedItems[i];
      itemCards.push(
        <ItemCard
          key={i}
          id={item._id}
          item={item}
          onCardClick={onCardClick}
          onCardLike={onCardLike}
        />
      );
    }
  }

  return (
    <main className="main">
      <WeatherCard weatherData={weatherData} />
      <section className="cards">
        <p className="cards__text">
          Today is {weatherData.temp[currentTemperatureUnit]}°
          {currentTemperatureUnit} / You may want to wear:
        </p>
        <ul className="cards__list">{itemCards}</ul>
      </section>
      <button type="button" className="main__randomize-button">
        <img
          src={randomizeImage}
          alt="Randomize Image"
          className="main__randomize-image"
        />
        <p className="main__randomize-text">Randomize</p>
      </button>
    </main>
  );
}
