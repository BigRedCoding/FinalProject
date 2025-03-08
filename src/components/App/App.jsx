//Styles
import "./App.css";

// 3rd-party resources
import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

//JSX

import RegistrationModal from "../RegistrationModal/RegistrationModal.jsx";
import LoginModal from "../LoginModal/LoginModal.jsx";
import EditProfileModal from "../EditProfileModal/EditProfileModal.jsx";
import Header from "../header/Header.jsx";
import Main from "../Main/Main.jsx";
import Footer from "../footer/Footer.jsx";

import WeatherModal from "../WeatherModal/WeatherModal.jsx";
import SourcesModal from "../SourcesModal/SourcesModal.jsx";
import SavedNews from "../SavedNews/SavedNews.jsx";

import LogoutModal from "../LogoutModal/LogoutModal.jsx";
import LikedByServer from "../LikedByServer/LikedByServer.jsx";
import RegistrationCompleteModal from "../RegistrationCompleteModal/RegistrationCompleteModal.jsx";

import ProtectedRoute from "../ProtectedRoute.jsx";
//Context
import CurrentUserContext from "../../contexts/CurrentUserContext.js";

//Utils
import { coordinates, WeatherAPIKey } from "../../utils/constants.js";
import {
  getAllArticles,
  addLike,
  removeLike,
  addFavorite,
  removeFavorite,
  handleLoginUser,
  handleSignupUser,
  handleUpdateProfile,
} from "../../utils/api.js";

//API imports
import {
  getWeather,
  filterWeatherData,
} from "../../utils/NewsApis/weatherapi.js";

//App Function
function App() {
  //-----------------------------//
  //3rd party data storage and interaction
  const [weatherData, setWeatherData] = useState({
    type: "",
    temp: { F: 0, C: 0 },
    city: "",
    considtion: "",
    isDay: false,
  });
  const [currentLocation, setCurrentLocation] = useState({});
  const [totalWeatherData, setTotalWeatherData] = useState({});

  //Modal variables
  const [hasPulledServerArticles, setHasPulledServerArticles] = useState(false);

  const [articlesTotal, setArticlesTotal] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [likedByQuery, setLikedByQuery] = useState("");

  const [activeModal, setActiveModal] = useState("");

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(true);

  const [navigationSelection, setNavigationSelection] = useState("home");

  //Account variables
  const [userData, setUserData] = useState({});

  //Basic Functions
  const closeActiveModal = () => {
    setActiveModal("");
  };

  const handleRegistrationClick = () => {
    setActiveModal("registration");
  };

  const handleRegistrationCompleteClick = () => {
    setActiveModal("registrationcomplete");
  };

  const handleLoginClick = () => {
    setActiveModal("login");
  };

  const handleOpenWeatherModal = () => {
    setActiveModal("weathermodal");
  };

  const handleEditProfileClick = () => {
    setActiveModal("editprofile");
  };

  const handleSourcesclick = () => {
    setActiveModal("sourcesmodal");
  };

  const handleLogoutClick = () => {
    setActiveModal("logoutmodal");
  };

  //Initialization functions

  const handleSetWeather = () => {
    getWeather(coordinates, WeatherAPIKey)
      .then((data) => {
        setTotalWeatherData(data);

        setCurrentLocation({
          latitude: data.coord.lat,
          longitude: data.coord.lon,
        });

        const filteredData = filterWeatherData(data);

        setWeatherData(filteredData);
      })
      .catch(console.error);
  };

  //Article Functions
  const handleSetAllArticles = () => {
    getAllArticles()
      .then((data) => {
        return setArticlesTotal(data);
      })
      .catch(console.error);
  };

  const handleArticleLike = (isLiked, articleData) => {
    const token = localStorage.getItem("jwt");

    if (!token) {
      alert("User token missing! Refresh the page and login again!");
      return;
    }

    if (!isLiked) {
      addLike(token, articleData)
        .then(() => {
          setArticlesTotal([]);
        })
        .then(() => {
          handleSetAllArticles();
        })
        .catch((err) => console.log("Error adding like:", err));
    } else {
      removeLike(token, articleData)
        .then(() => {
          setArticlesTotal([]);
        })
        .then(() => {
          handleSetAllArticles();
        })
        .catch((err) => console.log("Error removing like:", err));
    }
  };

  const handleArticleFavorite = (isFavorited, articleData) => {
    const token = localStorage.getItem("jwt");

    if (!token) {
      alert("User token missing! Refresh the page and login again!");
      return;
    }
    if (!isFavorited) {
      addFavorite(token, articleData)
        .then(() => {
          setArticlesTotal([]);
        })
        .then(() => {
          handleSetAllArticles();
        })
        .catch((err) => console.log("Error adding favorite:", err));
    } else {
      removeFavorite(token, articleData)
        .then(() => {
          setArticlesTotal([]);
        })
        .then(() => {
          handleSetAllArticles();
        })
        .catch((err) => console.log("Error removing favorite:", err));
    }
  };

  //User functions

  const handleLoginResponseInfo = () => {
    setIsLoggedIn(true);
    updateContext();
  };

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("userData");

    setIsLoggedIn(false);
    setUserData(null);
  };

  const updateUserInfo = (values) => {
    let userData = JSON.parse(localStorage.getItem("userData"));
    userData.userName = values.name;
    userData.userAvatar = values.avatar;
    localStorage.setItem("userData", JSON.stringify(userData));
  };

  const updateContext = () => {
    const token = localStorage.getItem("jwt");
    const storedUserData = JSON.parse(localStorage.getItem("userData"));

    if (token && storedUserData) {
      setIsLoggedIn(true);
      setUserData(storedUserData);
    } else {
      setIsLoggedIn(false);
      setUserData(null);
    }
  };

  const handleUpdateProfileInfo = (values) => {
    handleUpdateProfile(values)
      .then(() => {
        updateUserInfo(values);
        updateContext();
      })
      .then(() => {
        closeActiveModal();
      })
      .catch((error) => {
        console.error("Profile update failed:", error);
      });
  };

  useEffect(() => {
    if (!activeModal) return;

    const handleEscClose = (e) => {
      if (e.key === "Escape") {
        closeActiveModal();
      }
    };

    document.addEventListener("keydown", handleEscClose);

    return () => {
      document.removeEventListener("keydown", handleEscClose);
    };
  }, [activeModal]);

  useEffect(() => {
    if (!hasPulledServerArticles) {
      handleSetAllArticles();

      handleSetWeather();
      updateContext();
      setHasPulledServerArticles(true);
    }
  }, []);

  return (
    <div className="page">
      <CurrentUserContext.Provider
        value={{
          isLoggedIn,
          userData,
          isPasswordValid,
          weatherData,
        }}
      >
        <div className="page__content">
          <Header onOpenWeatherModal={handleOpenWeatherModal} />
          <Routes>
            <Route
              path="/"
              element={
                <Main
                  onLoginClick={handleLoginClick}
                  onRegistrationClick={handleRegistrationClick}
                  setNavigationSelection={setNavigationSelection}
                  onEditProfileClick={handleEditProfileClick}
                  onLogoutClick={handleLogoutClick}
                  navigationSelection={navigationSelection}
                  onArticleLike={handleArticleLike}
                  onArticleFavorite={handleArticleFavorite}
                  articlesTotal={articlesTotal}
                  searchResults={searchResults}
                  setSearchResults={setSearchResults}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                />
              }
            />
            <Route
              path="/liked-by-server"
              element={
                <LikedByServer
                  onLoginClick={handleLoginClick}
                  onRegistrationClick={handleRegistrationClick}
                  setNavigationSelection={setNavigationSelection}
                  onEditProfileClick={handleEditProfileClick}
                  onLogoutClick={handleLogoutClick}
                  navigationSelection={navigationSelection}
                  onArticleLike={handleArticleLike}
                  onArticleFavorite={handleArticleFavorite}
                  articlesTotal={articlesTotal}
                  likedByQuery={likedByQuery}
                  setLikedByQuery={setLikedByQuery}
                />
              }
            />
            <Route
              path="/saved-news"
              element={
                <ProtectedRoute isLoggedIn={isLoggedIn}>
                  <SavedNews
                    onLoginClick={handleLoginClick}
                    onRegistrationClick={handleRegistrationClick}
                    setNavigationSelection={setNavigationSelection}
                    onEditProfileClick={handleEditProfileClick}
                    onLogoutClick={handleLogoutClick}
                    navigationSelection={navigationSelection}
                    onArticleLike={handleArticleLike}
                    onArticleFavorite={handleArticleFavorite}
                    articlesTotal={articlesTotal}
                  />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Footer
            onSourcesClick={handleSourcesclick}
            setNavigationSelection={setNavigationSelection}
          />
        </div>
        <RegistrationModal
          onSignUpUser={handleSignupUser}
          onCloseClick={closeActiveModal}
          isOpened={activeModal === "registration" && "modal_opened"}
          onLoginClick={handleLoginClick}
          onLoginUser={handleLoginUser}
          onLoginResponseInfo={handleLoginResponseInfo}
          onIsPasswordValid={setIsPasswordValid}
          onRegistrationCompleteClick={handleRegistrationCompleteClick}
        />
        <LoginModal
          onCloseClick={closeActiveModal}
          onLoginUser={handleLoginUser}
          isOpened={activeModal === "login" && "modal_opened"}
          onRegistrationClick={handleRegistrationClick}
          onLoginResponseInfo={handleLoginResponseInfo}
          onIsPasswordValid={setIsPasswordValid}
        />
        <EditProfileModal
          onCloseClick={closeActiveModal}
          isOpened={activeModal === "editprofile" && "modal_opened"}
          onUpdateProfileInfo={handleUpdateProfileInfo}
        />
        <WeatherModal
          totalWeatherData={totalWeatherData}
          isOpened={activeModal === "weathermodal" && "modal_opened"}
          onCloseClick={closeActiveModal}
          currentLocation={currentLocation}
        />
        <SourcesModal
          isOpened={activeModal === "sourcesmodal" && "modal_opened"}
          onCloseClick={closeActiveModal}
        />
        <LogoutModal
          isOpened={activeModal === "logoutmodal" && "modal_opened"}
          onLogout={handleLogout}
          onCloseClick={closeActiveModal}
        />
        <RegistrationCompleteModal
          isOpened={activeModal === "registrationcomplete" && "modal_opened"}
          onLoginClick={handleLoginClick}
          onCloseClick={closeActiveModal}
        />
      </CurrentUserContext.Provider>
    </div>
  );
}

export default App;
