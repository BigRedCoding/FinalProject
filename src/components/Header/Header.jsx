import "./Header.css";

import HeaderCard from "../HeaderCard/HeaderCard.jsx";
import HeaderBar from "../HeaderBar/HeaderBar.jsx";

export default function Header({ onOpenWeatherModal }) {
  return (
    <div className="header">
      <HeaderCard onOpenWeatherModal={onOpenWeatherModal} />
      <HeaderBar />
    </div>
  );
}
