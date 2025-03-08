import "./Footer.css";
import { Link } from "react-router-dom";

function Footer({ onSourcesClick, setNavigationSelection }) {
  const setHomeSelected = () => {
    setNavigationSelection("home");
  };

  return (
    <footer className="footer">
      <div className="footer__text-container">
        <div className="footer__source-container">
          <p className="footer__detail">
            Powered by NewsApp, NewsData, Gnews, Finnhub,
          </p>
          <p className="footer__detail">
            The Guardian, Hacker News, Open Weather Map,
          </p>
          <p className="footer__detail">
            and Open-Meteo. Links available{" "}
            <button
              type="button"
              className="footer__links-button"
              onClick={onSourcesClick}
            >
              here
            </button>
          </p>
        </div>
        <div className="footer__author-container">
          <p className="footer__detail-copy">
            &copy;{new Date().getFullYear()}
          </p>
          <p className="footer__detail-copy">Brandon Dooley</p>
        </div>
      </div>
      <div className="footer__links-container">
        <div className="footer__text-links-container">
          <Link to="/" className="footer__home-link">
            <button
              type="button"
              onClick={setHomeSelected}
              className="footer__home"
            >
              Home
            </button>
          </Link>
          <button
            type="button"
            onClick={() => window.open("https://www.tripleten.com", "_blank")}
            className="footer__triple-ten"
          >
            TripleTen
          </button>
        </div>
        <div className="footer__icons-container">
          <button
            type="button"
            onClick={() =>
              window.open(
                "https://github.com/BigRedCoding/FinalProject",
                "_blank"
              )
            }
            className="footer__github"
          ></button>
          <button
            type="button"
            onClick={() =>
              window.open(
                "https://www.linkedin.com/in/brandon-roy-dooley/",
                "_blank"
              )
            }
            className="footer__linkedin"
          ></button>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
