import "./SourcesModal.css";
import React, { useState } from "react";

import FinnhubLogo from "../../assets/finnhub-logo.webp";
import OpenWeatherLogo from "../../assets/openweatherlogo.png";
import GnewsLogo from "../../assets/gnewslogo.svg";
import TheGuardianLogo from "../../assets/theguardianlogo.png";
import NewsApiLogo from "../../assets/newsapilogo.png";
import NewsDataLogo from "../../assets/newsdata-icon.png";
import OpenMeteoLogo from "../../assets/openmeteologo.png";

export default function SourcesModal({ isOpened, onCloseClick }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isHovered2, setIsHovered2] = useState(false);
  const [isHovered3, setIsHovered3] = useState(false);
  const [isHovered4, setIsHovered4] = useState(false);
  const [isHovered5, setIsHovered5] = useState(false);
  const [isHovered6, setIsHovered6] = useState(false);
  const [isHovered7, setIsHovered7] = useState(false);
  const [isHovered8, setIsHovered8] = useState(false);
  return (
    <div className={`sources-modal ${isOpened}`}>
      <div className="sources-modal__container">
        <button
          className="sources-modal__close-button"
          onClick={onCloseClick}
        ></button>
        <p className="sources-modal__title">Sources and links</p>
        <ul className="sources-modal__list">
          <li className="sources-modal__list-item">
            <div className="sources-modal__source-container">
              <div className="sources-modal__text-container">
                <p className="sources-modal__number-text">1</p>
              </div>
              <div className="sources-modal__image-container">
                {" "}
                <img
                  src={NewsApiLogo}
                  alt="NewsApi Logo"
                  className="sources-modal__image"
                />
              </div>

              <p className="sources-modal__text">NewsApi</p>
              <button
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="sources-modal__link-button"
                onClick={() => window.open("https://newsapi.org/", "_blank")}
              >
                {isHovered ? (
                  <>
                    <div className="sources-modal__span-container">
                      <span className="sources-modal__link-tooltip">
                        https://newsapi.org/
                      </span>
                    </div>
                    <p className="sources-modal__link-button-text">
                      https://newsapi.org/
                    </p>
                  </>
                ) : (
                  <p className="sources-modal__link-button-text">
                    https://newsapi.org/
                  </p>
                )}
              </button>
            </div>
          </li>
          <li className="sources-modal__list-item">
            <div className="sources-modal__source-container">
              <div className="sources-modal__text-container">
                <p className="sources-modal__number-text">2</p>
              </div>
              <div className="sources-modal__image-container">
                <img
                  src={NewsDataLogo}
                  alt="NewsData Logo"
                  className="sources-modal__image"
                />
              </div>

              <p className="sources-modal__text">NewsData</p>
              <button
                onMouseEnter={() => setIsHovered2(true)}
                onMouseLeave={() => setIsHovered2(false)}
                className="sources-modal__link-button"
                onClick={() => window.open("https://newsdata.io/", "_blank")}
              >
                {isHovered2 ? (
                  <>
                    <div className="sources-modal__span-container">
                      <span className="sources-modal__link-tooltip">
                        https://newsdata.io/
                      </span>
                    </div>
                    <p className="sources-modal__link-button-text">
                      https://newsdata.io/
                    </p>
                  </>
                ) : (
                  <p className="sources-modal__link-button-text">
                    https://newsdata.io/
                  </p>
                )}
              </button>
            </div>
          </li>
          <li className="sources-modal__list-item">
            <div className="sources-modal__source-container">
              <div className="sources-modal__text-container">
                <p className="sources-modal__number-text">3</p>
              </div>
              <div className="sources-modal__image-container">
                <img
                  src={GnewsLogo}
                  alt="GNews Logo"
                  className="sources-modal__image"
                />
              </div>

              <p className="sources-modal__text">GNews</p>
              <button
                onMouseEnter={() => setIsHovered3(true)}
                onMouseLeave={() => setIsHovered3(false)}
                className="sources-modal__link-button"
                onClick={() => window.open("https://gnews.io/", "_blank")}
              >
                {isHovered3 ? (
                  <>
                    <div className="sources-modal__span-container">
                      <span className="sources-modal__link-tooltip">
                        https://gnews.io/
                      </span>
                    </div>
                    <p className="sources-modal__link-button-text">
                      https://gnews.io/
                    </p>
                  </>
                ) : (
                  <p className="sources-modal__link-button-text">
                    https://gnews.io/
                  </p>
                )}
              </button>
            </div>
          </li>
          <li className="sources-modal__list-item">
            <div className="sources-modal__source-container">
              <div className="sources-modal__text-container">
                <p className="sources-modal__number-text">4</p>
              </div>
              <div className="sources-modal__image-container">
                {" "}
                <img
                  src={FinnhubLogo}
                  alt="Finnhub Logo"
                  className="sources-modal__image"
                />
              </div>

              <p className="sources-modal__text">Finnhub</p>
              <button
                onMouseEnter={() => setIsHovered4(true)}
                onMouseLeave={() => setIsHovered4(false)}
                className="sources-modal__link-button"
                onClick={() => window.open(" https://finnhub.io/", "_blank")}
              >
                {isHovered4 ? (
                  <>
                    <div className="sources-modal__span-container">
                      <span className="sources-modal__link-tooltip">
                        https://finnhub.io/
                      </span>
                    </div>
                    <p className="sources-modal__link-button-text">
                      https://finnhub.io/
                    </p>
                  </>
                ) : (
                  <p className="sources-modal__link-button-text">
                    https://finnhub.io/
                  </p>
                )}
              </button>
            </div>
          </li>
          <li className="sources-modal__list-item">
            <div className="sources-modal__source-container">
              <div className="sources-modal__text-container">
                <p className="sources-modal__number-text">5</p>
              </div>
              <div className="sources-modal__image-container">
                {" "}
                <img
                  src={TheGuardianLogo}
                  alt="The Guardian Logo"
                  className="sources-modal__image"
                />
              </div>

              <p className="sources-modal__text">The Guardian</p>
              <button
                onMouseEnter={() => setIsHovered5(true)}
                onMouseLeave={() => setIsHovered5(false)}
                className="sources-modal__link-button"
                onClick={() =>
                  window.open(
                    "https://open-platform.theguardian.com/",
                    "_blank"
                  )
                }
              >
                {isHovered5 ? (
                  <>
                    <div className="sources-modal__span-container">
                      <span className="sources-modal__link-tooltip">
                        https://open-platform.theguardian.com/
                      </span>
                    </div>
                    <p className="sources-modal__link-button-text">
                      https://open-platform.theguardian.com/
                    </p>
                  </>
                ) : (
                  <p className="sources-modal__link-button-text">
                    https://open-platform.theguardian.com/
                  </p>
                )}
              </button>
            </div>
          </li>
          <li className="sources-modal__list-item">
            <div className="sources-modal__source-container">
              <div className="sources-modal__text-container">
                <p className="sources-modal__number-text">6</p>
              </div>
              <div className="sources-modal__image-container">
                <div className="sources-modal__hn-image">
                  <span className="sources-modal__span">HN</span>
                </div>
              </div>

              <p className="sources-modal__text">Hacker News</p>
              <button
                onMouseEnter={() => setIsHovered6(true)}
                onMouseLeave={() => setIsHovered6(false)}
                className="sources-modal__link-button"
                onClick={() =>
                  window.open(
                    " https://github.com/HackerNews/API?tab=readme-ov-file",
                    "_blank"
                  )
                }
              >
                {isHovered6 ? (
                  <>
                    <div className="sources-modal__span-container">
                      <span className="sources-modal__link-tooltip">
                        https://github.com/HackerNews/API?tab=readme-ov-file
                      </span>
                    </div>
                    <p className="sources-modal__link-button-text">
                      https://github.com/HackerNews/API?tab=readme-ov-file
                    </p>
                  </>
                ) : (
                  <p className="sources-modal__link-button-text">
                    https://github.com/HackerNews/API?tab=readme-ov-file
                  </p>
                )}
              </button>
            </div>
          </li>
          <li className="sources-modal__list-item">
            <div className="sources-modal__source-container">
              <div className="sources-modal__text-container">
                <p className="sources-modal__number-text">7</p>
              </div>
              <div className="sources-modal__image-container">
                <img
                  src={OpenWeatherLogo}
                  alt="Open Weather Logo"
                  className="sources-modal__image"
                />
              </div>

              <p className="sources-modal__text">Open Weather</p>
              <button
                onMouseEnter={() => setIsHovered7(true)}
                onMouseLeave={() => setIsHovered7(false)}
                className="sources-modal__link-button"
                onClick={() =>
                  window.open("https://openweathermap.org/", "_blank")
                }
              >
                {isHovered7 ? (
                  <>
                    <div className="sources-modal__span-container">
                      <span className="sources-modal__link-tooltip">
                        https://openweathermap.org/
                      </span>
                    </div>
                    <p className="sources-modal__link-button-text">
                      https://openweathermap.org/
                    </p>
                  </>
                ) : (
                  <p className="sources-modal__link-button-text">
                    https://openweathermap.org/
                  </p>
                )}
              </button>
            </div>
          </li>
          <li className="sources-modal__list-item">
            <div className="sources-modal__source-container">
              <div className="sources-modal__text-container">
                <p className="sources-modal__number-text">8</p>
              </div>
              <div className="sources-modal__image-container">
                {" "}
                <img
                  src={OpenMeteoLogo}
                  alt="Open-Meteo logo"
                  className="sources-modal__image"
                />
              </div>

              <p className="sources-modal__text">Open-Meteo</p>
              <button
                onMouseEnter={() => setIsHovered8(true)}
                onMouseLeave={() => setIsHovered8(false)}
                className="sources-modal__link-button"
                onClick={() => window.open("https://open-meteo.com/", "_blank")}
              >
                {isHovered8 ? (
                  <>
                    <div className="sources-modal__span-container">
                      <span className="sources-modal__link-tooltip">
                        https://open-meteo.com/
                      </span>
                    </div>
                    <p className="sources-modal__link-button-text">
                      https://open-meteo.com/
                    </p>
                  </>
                ) : (
                  <p className="sources-modal__link-button-text">
                    https://open-meteo.com/
                  </p>
                )}
              </button>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}
