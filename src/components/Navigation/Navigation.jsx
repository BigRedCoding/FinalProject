import { useContext, useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";

import "./Navigation.css";

import NewsExplorerLogo from "../../assets/newsexplorerlogo.jpg";

import CurrentUserContext from "../../contexts/CurrentUserContext.js";

import logoutImage from "../../assets/logout.svg";
import logoutBlackImage from "../../assets/logoutblack.svg";

export default function Navigation({
  onLoginClick,
  setNavigationSelection,
  onEditProfileClick,
  onLogoutClick,
  navigationSelection,
}) {
  const { isLoggedIn, userData } = useContext(CurrentUserContext);
  const [isHidden, setIsHidden] = useState(false);
  const [isHidden2, setIsHidden2] = useState(true);

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const [activeLine, setActiveLine] = useState("");

  const location = useLocation();

  const lineClassMod =
    navigationSelection === "home" ? "" : "navigation_line-mod";

  const textClassMod =
    navigationSelection === "home" ? "" : "navigation_text-mod";

  const logoutSource =
    navigationSelection === "home" || windowWidth < 500
      ? logoutImage
      : logoutBlackImage;

  const altMenuImage =
    navigationSelection === "home" ? "" : "mobile-button_mod";

  useEffect(() => {
    if (location.pathname === "/") {
      setNavigationSelection("home");
    } else if (location.pathname === "/liked-by-server") {
      setNavigationSelection("likedbyserver");
    } else if (location.pathname === "/saved-news") {
      setNavigationSelection("profile");
    }
  }, [location.pathname, setNavigationSelection]);

  const menuToggle = () => {
    setIsHidden(!isHidden);
    setIsHidden2(!isHidden2);
  };

  const handleHomeClick = () => {
    setNavigationSelection("home");
  };

  const handleLikedByServerClick = () => {
    setNavigationSelection("likedbyserver");
  };

  const handleSavedNewsClick = () => {
    setNavigationSelection("profile");
  };

  useEffect(() => {
    if (windowWidth < 500) {
      setIsHidden(false);
      setIsHidden2(true);
    }
  }, [windowWidth]);

  useEffect(() => {
    setActiveLine(navigationSelection);
  }, [navigationSelection]);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <div className="navigation">
      <img
        src={NewsExplorerLogo}
        alt="News Explorer logo"
        className="navigation__logo"
      />
      {isLoggedIn ? (
        <div className="navigation__loggedin-container">
          <div className="navigation__loggedin-links">
            <Link to="/" className="navigation__home">
              <button
                type="button"
                className={`navigation__home-button ${textClassMod}`}
                onClick={handleHomeClick}
              >
                Home
              </button>
              {activeLine === "home" && (
                <div
                  className={`navigation__line ${lineClassMod} ${
                    activeLine === "home" ? "active" : ""
                  }`}
                ></div>
              )}
            </Link>

            <Link to="/liked-by-server" className="navigation__liked-server">
              <button
                type="button"
                className={`navigation__liked-server-button ${textClassMod}`}
                onClick={handleLikedByServerClick}
              >
                Liked by server
              </button>
              {activeLine === "likedbyserver" && (
                <div
                  className={`navigation__line ${lineClassMod} ${
                    activeLine === "likedbyserver" ? "active" : ""
                  }`}
                ></div>
              )}
            </Link>

            <Link to="/saved-news" className="navigation__saved-articles">
              <button
                type="button"
                className={`navigation__saved-articles-button ${textClassMod}`}
                onClick={handleSavedNewsClick}
              >
                Saved articles
              </button>
              {activeLine === "profile" && (
                <div
                  className={`navigation__line ${lineClassMod} ${
                    activeLine === "profile" ? "active" : ""
                  }`}
                ></div>
              )}
            </Link>
          </div>

          <div className="navigation__user-info">
            <p className={`navigation__user-name ${textClassMod}`}>
              {userData?.userName || ""}
            </p>
            {userData?.userAvatar ? (
              <button
                type="button"
                onClick={onEditProfileClick}
                className="navigation__avatar-button"
              >
                <img
                  className="navigation__avatar-image"
                  src={userData?.userAvatar || ""}
                  alt="Avatar image"
                />
              </button>
            ) : (
              <div className="avatar_image avatar__alternate">
                <button
                  type="button"
                  onClick={onEditProfileClick}
                  className="navigation__avatar-button"
                >
                  <p className={`navigation__avatar-alt ${textClassMod}`}>
                    {userData?.userName?.charAt(0)}
                  </p>
                </button>
              </div>
            )}
            <button
              type="button"
              onClick={onLogoutClick}
              className="navigation__logout-button"
            >
              <img src={logoutSource} alt="Logout image" />
            </button>
          </div>
        </div>
      ) : (
        <div className="navigation__login">
          <Link to="/" className="navigation__home">
            <button
              type="button"
              className={`navigation__home-button ${textClassMod}`}
              onClick={handleHomeClick}
            >
              Home
            </button>
            {activeLine === "home" && (
              <div
                className={`navigation__line ${lineClassMod} ${
                  activeLine === "home" ? "active" : ""
                }`}
              ></div>
            )}
          </Link>
          <Link to="/liked-by-server" className="navigation__liked-server">
            <button
              type="button"
              className={`navigation__liked-server-button ${textClassMod}`}
              onClick={handleLikedByServerClick}
            >
              Liked by server
            </button>
            {activeLine === "likedbyserver" && (
              <div
                className={`navigation__line ${lineClassMod} ${
                  activeLine === "likedbyserver" ? "active" : ""
                }`}
              ></div>
            )}
          </Link>
          <button
            type="button"
            onClick={onLoginClick}
            className={`navigation__login-button ${textClassMod}`}
          >
            Sign in
          </button>
        </div>
      )}
      <div
        className={`navigation__mobile-container ${
          isHidden ? "mobile_container-mod" : ""
        }`}
      >
        <div className="navigation__mobile-container-header ">
          <p
            className={`navigation__mobile-title ${
              isHidden2 ? textClassMod : ""
            }`}
          >
            News Explorer
          </p>
          <button
            type="button"
            onClick={menuToggle}
            className={`navigation__mobile-button ${altMenuImage} ${
              isHidden ? "isHidden" : ""
            }`}
          ></button>
          <button
            type="button"
            onClick={menuToggle}
            className={`navigation__mobile-close-button ${
              isHidden2 ? "isHidden" : ""
            }`}
          ></button>
        </div>
        <div
          className={`navigation__mobile-container-menu ${
            isHidden2 ? "isHidden" : "mobile-container_mod"
          }`}
        >
          {isLoggedIn ? (
            <div
              className={`navigation__loggedin-container-mobile ${
                isHidden ? "isVisible" : ""
              }`}
            >
              <div className="navigation__loggedin-links">
                <Link to="/" className="navigation__home">
                  <button
                    type="button"
                    className={`navigation__home-button`}
                    onClick={handleHomeClick}
                  >
                    Home
                  </button>
                  {activeLine === "home" && (
                    <div
                      className={`navigation__line${
                        activeLine === "home" ? "active" : ""
                      }`}
                    ></div>
                  )}
                </Link>

                <Link
                  to="/liked-by-server"
                  className="navigation__liked-server"
                >
                  <button
                    type="button"
                    className={`navigation__liked-server-button`}
                    onClick={handleLikedByServerClick}
                  >
                    Liked by server
                  </button>
                  {activeLine === "likedbyserver" && (
                    <div
                      className={`navigation__line ${
                        activeLine === "likedbyserver" ? "active" : ""
                      }`}
                    ></div>
                  )}
                </Link>

                <Link to="/saved-news" className="navigation__saved-articles">
                  <button
                    type="button"
                    className={`navigation__saved-articles-button`}
                    onClick={handleSavedNewsClick}
                  >
                    Saved articles
                  </button>
                  {activeLine === "profile" && (
                    <div
                      className={`navigation__line ${
                        activeLine === "profile" ? "active" : ""
                      }`}
                    ></div>
                  )}
                </Link>
              </div>

              <div className="navigation__user-info-mobile">
                <p
                  className={`navigation__user-name-mobile ${
                    isHidden ? "isVisible" : ""
                  }`}
                >
                  {userData?.userName || ""}
                </p>
                {userData?.userAvatar ? (
                  <button
                    type="button"
                    onClick={onEditProfileClick}
                    className="navigation__avatar-button"
                  >
                    <img
                      className="navigation__avatar-image"
                      src={userData?.userAvatar || ""}
                      alt="Avatar image"
                    />
                  </button>
                ) : (
                  <div className="avatar_image avatar__alternate">
                    <button
                      type="button"
                      onClick={onEditProfileClick}
                      className="navigation__avatar-button"
                    >
                      <p className={`navigation__avatar-alt`}>
                        {userData?.userName?.charAt(0)}
                      </p>
                    </button>
                  </div>
                )}
                <button
                  type="button"
                  onClick={onLogoutClick}
                  className="navigation__logout-button"
                >
                  <img src={logoutSource} alt="Logout image" />
                </button>
              </div>
            </div>
          ) : (
            <div
              className={`navigation__login-mobile ${
                isHidden ? "isVisible" : ""
              }`}
            >
              <div className="navigation__links-mobile">
                <Link to="/" className="navigation__home">
                  <button
                    type="button"
                    className={`navigation__home-button `}
                    onClick={handleHomeClick}
                  >
                    Home
                  </button>
                  {activeLine === "home" && (
                    <div
                      className={`navigation__line  ${
                        activeLine === "home" ? "active" : ""
                      }`}
                    ></div>
                  )}
                </Link>
                <Link
                  to="/liked-by-server"
                  className="navigation__liked-server"
                >
                  <button
                    type="button"
                    className={`navigation__liked-server-button `}
                    onClick={handleLikedByServerClick}
                  >
                    Liked by server
                  </button>
                  {activeLine === "likedbyserver" && (
                    <div
                      className={`navigation__line  ${
                        activeLine === "likedbyserver" ? "active" : ""
                      }`}
                    ></div>
                  )}
                </Link>
              </div>
              <div className="navigation_login-container-mobile">
                <button
                  type="button"
                  onClick={onLoginClick}
                  className={`navigation__login-button login-button_mod `}
                >
                  Sign in
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
