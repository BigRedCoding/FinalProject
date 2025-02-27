import { useContext, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

import "./Navigation.css";
import CurrentUserContext from "../../contexts/CurrentUserContext.js";

import logoutImage from "../../assets/logout.svg";
import logoutBlackImage from "../../assets/logoutblack.svg";

export default function Navigation({
  onLoginClick,
  setIsProfileSelected,
  onEditProfileClick,
  onLogoutClick,
}) {
  const { isLoggedIn, userData, isProfileSelected } =
    useContext(CurrentUserContext);

  const [activeLine, setActiveLine] = useState("");

  const location = useLocation();

  const lineClassMod =
    isProfileSelected === "home" ? "" : "navigation_line-mod";

  const textClassMod =
    isProfileSelected === "home" ? "" : "navigation_text-mod";

  const logoutSource =
    isProfileSelected === "home" ? logoutImage : logoutBlackImage;

  useEffect(() => {
    if (location.pathname === "/") {
      setIsProfileSelected("home");
    } else if (location.pathname === "/liked-by-server") {
      setIsProfileSelected("likedbyserver");
    } else if (location.pathname === "/saved-news") {
      setIsProfileSelected("profile");
    }
  }, [location.pathname, setIsProfileSelected]);

  const handleHomeClick = () => {
    setIsProfileSelected("home");
  };

  const handleLikedByServerClick = () => {
    setIsProfileSelected("likedbyserver");
  };

  const handleSavedNewsClick = () => {
    setIsProfileSelected("profile");
  };

  useEffect(() => {
    setActiveLine(isProfileSelected);
  }, [isProfileSelected]);
  return (
    <div className="navigation">
      <p className={`navigation__logo ${textClassMod}`}>News Explorer</p>
      {isLoggedIn ? (
        <div className="navigation__loggedin-container">
          <div className="navigation__loggedin-links">
            <Link to="/" className="navigation__home">
              <button
                type="button"
                className={`navigation__home-button ${textClassMod}`}
                onClick={handleHomeClick} // Handle click for Home
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
            onClick={onLoginClick}
            type="button"
            className={`navigation__login-button ${textClassMod}`}
          >
            Log In
          </button>
        </div>
      )}
    </div>
  );
}
