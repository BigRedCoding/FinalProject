import "./Preloader.css";

import PreloaderImage from "../../assets/ellipse.svg";

export default function Preloader() {
  return (
    <div className="preloader">
      <div className="preloader__container">
        <img
          src={PreloaderImage}
          alt="Preloader image"
          className="preloader__image"
        />
        <p className="preloader__text">Searching for news...</p>
      </div>
    </div>
  );
}
