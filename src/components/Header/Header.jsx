import "./Header.css";

import HeaderCard from "../HeaderCard/HeaderCard.jsx";
import HeaderBar from "../HeaderBar/HeaderBar.jsx";

export default function Header({
  startApiTrigger,
  setStartApiTrigger,
  onOpenWeatherModal,
}) {
  return (
    <div className="header">
      <HeaderCard onOpenWeatherModal={onOpenWeatherModal} />
      <HeaderBar
        startApiTrigger={startApiTrigger}
        setStartApiTrigger={setStartApiTrigger}
      />
    </div>
  );
}
