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

import ProtectedRoute from "../ProtectedRoute.jsx";

//Context
import CurrentUserContext from "../../contexts/CurrentUserContext.js";
import CurrentTemperatureUnitContext from "../../contexts/CurrentTemperatureUnitContext.js";

//Utils
import { coordinates, WeatherAPIKey } from "../../utils/constants.js";
import {
  getArticlesByLikes,
  getArticlesByFavorite,
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
  returnCoordinates,
} from "../../utils/NewsApis/weatherapi.js";
import { getHackerNews } from "../../utils/NewsApis/hackernewsapi.js";
import { getTheGuardianNews } from "../../utils/NewsApis/theguardian.js";
import { getGnewsNews } from "../../utils/NewsApis/Gnews.js";

import { fetchAndDisplayData } from "../../utils/NewsApis/finnhub.js";
import { searchArticles } from "../../utils/NewsApis/newsapp.js";

import fetchWeatherData from "../../utils/NewsApis/otherweatherapi.js";

//Dev
import DevPanel from "../DevPanel/DevPanel.jsx";
import { getNewsData } from "../../utils/NewsApis/newsdata.js";
import LogoutModal from "../LogoutModal/LogoutModal.jsx";
import LikedByServer from "../LikedByServer/LikedByServer.jsx";

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
  const [currentTemperatureUnit, setCurrentTemperatureUnit] = useState("F");

  //Modal variables
  const [articlesLiked, setArticlesLiked] = useState([]);
  const [articlesFavorited, setArticlesFavorited] = useState([]);

  const [activeModal, setActiveModal] = useState("");

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [updateDOM, handleUpdateDOM] = useState(false);
  const [isProfileSelected, setIsProfileSelected] = useState("home");

  const [triggerUseEffect, setTriggerUseEffect] = useState(false);

  //Dev Variables
  const [startApiTrigger, setStartApiTrigger] = useState(false);

  //Account variables
  const [userData, setUserData] = useState({});

  //Basic Functions
  const handleAddClick = () => {
    setActiveModal("garment");
  };

  const handleDeleteClick = () => {
    setActiveModal("delete");
  };

  const closeActiveModal = () => {
    setActiveModal("");
  };

  const handleRegistrationClick = () => {
    setActiveModal("registration");
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

  const handleToggleSwitchChange = () => {
    setCurrentTemperatureUnit(currentTemperatureUnit === "F" ? "C" : "F");
  };

  //Article Functions

  const handleSetLikedArticles = () => {
    // Only fetch if data hasn't been fetched yet
    getArticlesByLikes()
      .then((data) => {
        console.log("Fetched data:", data);
        setArticlesLiked(data);
      })
      .catch(console.error);
  };

  const handleSetFavoriteArticles = () => {
    const token = localStorage.getItem("jwt");

    if (token) {
      getArticlesByFavorite(token)
        .then((data) => {
          setArticlesFavorited(data);
        })
        .catch(console.error);
    }
  };

  const handleArticleLike = (isLiked, articleData) => {
    const token = localStorage.getItem("jwt");

    if (!token) {
      console.log("User is not authenticated.");
      return;
    }
    if (!isLiked) {
      addLike(token, articleData)
        .then(() => {
          const newArticlesLiked = [...articlesLiked, articleData];
          setArticlesLiked([]);
          setArticlesLiked(newArticlesLiked);
        })
        .catch((err) => console.log("Error adding like:", err));
    } else {
      removeLike(token, articleData)
        .then(() => {
          console.log("like removed. need to update list");
        })
        .catch((err) => console.log("Error removing like:", err));
    }
  };

  const handleArticleFavorite = (isFavorited, articleData) => {
    const token = localStorage.getItem("jwt");

    if (!token) {
      console.log("User is not authenticated.");
      return;
    }
    if (!isFavorited) {
      addFavorite(token, articleData)
        .then(() => {
          const newArticlesFavorite = [...articlesFavorited, articleData];
          setArticlesFavorited([]);
          setArticlesFavorited(newArticlesFavorite);
        })
        .catch((err) => console.log("Error adding like:", err));
    } else {
      removeFavorite(token, articleData)
        .then(() => {
          console.log("favorite removed. need to update list");
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

  //Hacker News Functions

  const handleHackNewsTopStories = () => {
    getHackerNews();
  };

  //TheGuardians News Functions

  const handleTheGuardiansNews = () => {
    getTheGuardianNews(); //needs variable
  };

  //Gnews News Functions

  const handleGnews = (query) => {
    getGnewsNews(query);
  };

  //NewsApp Functions

  const handleNewsApp = () => {
    searchArticles(query);
  };

  //Finnhub Functions

  const handleFinnhub = () => {
    fetchAndDisplayData();
  };

  //Use Effects
  useEffect(() => {
    handleSetWeather();
    updateContext();
    handleUpdateDOM(!updateDOM);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      handleSetFavoriteArticles();
    }
  }, [isLoggedIn]);

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
    handleUpdateDOM(!updateDOM);
  }, [weatherData]);

  //Dev
  const [devVisible, setDevVisible] = useState("isHidden");
  const setDevPanelVisibility = () => {
    setDevVisible();
  };

  const setDevButton1 = () => {
    console.log("Articles liked:", articlesLiked);
    console.log("Articles Favorited:", articlesFavorited);
  };
  const setDevButton2 = () => {
    searchArticles("trump");
  };
  const setDevButton3 = () => {
    getGnewsNews("trump");
  };
  const setDevButton4 = () => {
    getNewsData("trump");
  };
  const setDevButton5 = () => {
    console.log("starting api's");
    setStartApiTrigger(true);
  };
  const deleteToken = () => {
    localStorage.removeItem("randomizedResults");
  };

  return (
    <div className="page">
      <CurrentUserContext.Provider
        value={{
          isLoggedIn,
          userData,
          isPasswordValid,
          weatherData,
          updateDOM,
          articlesLiked,
          articlesFavorited,
          isProfileSelected,
        }}
      >
        <CurrentTemperatureUnitContext.Provider
          value={{ currentTemperatureUnit, handleToggleSwitchChange }}
        >
          <div className="page__content">
            <button className="dev" onClick={setDevPanelVisibility}>
              DevPanel
            </button>
            <Header
              startApiTrigger={startApiTrigger}
              setStartApiTrigger={setStartApiTrigger}
              onOpenWeatherModal={handleOpenWeatherModal}
            />
            <Routes>
              <Route
                path="/"
                element={
                  <Main
                    onLoginClick={handleLoginClick}
                    onRegistrationClick={handleRegistrationClick}
                    setIsProfileSelected={setIsProfileSelected}
                    onEditProfileClick={handleEditProfileClick}
                    onLogoutClick={handleLogoutClick}
                    isProfileSelected={isProfileSelected}
                    onArticleLike={handleArticleLike}
                    onArticleFavorite={handleArticleFavorite}
                  />
                }
              />
              <Route
                path="/liked-by-server"
                element={
                  <LikedByServer
                    onLoginClick={handleLoginClick}
                    setIsProfileSelected={setIsProfileSelected}
                    onEditProfileClick={handleEditProfileClick}
                    onLogoutClick={handleLogoutClick}
                    isProfileSelected={isProfileSelected}
                    onArticleLike={handleArticleLike}
                    onArticleFavorite={handleArticleFavorite}
                    onSetLikedArticles={handleSetLikedArticles}
                  />
                }
              />
              <Route
                path="/saved-news"
                element={
                  <ProtectedRoute isLoggedIn={isLoggedIn}>
                    <SavedNews
                      onLoginClick={handleLoginClick}
                      setIsProfileSelected={setIsProfileSelected}
                      onEditProfileClick={handleEditProfileClick}
                      onLogoutClick={handleLogoutClick}
                      isProfileSelected={isProfileSelected}
                      onArticleLike={handleArticleLike}
                      onArticleFavorite={handleArticleFavorite}
                      onSetFavoriteArticles={handleSetFavoriteArticles}
                    />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <Footer onSourcesClick={handleSourcesclick} />
          </div>
          <RegistrationModal
            onSignUpUser={handleSignupUser}
            onCloseClick={closeActiveModal}
            isOpened={activeModal === "registration" && "modal_opened"}
            onLoginClick={handleLoginClick}
            onLoginUser={handleLoginUser}
            onLoginResponseInfo={handleLoginResponseInfo}
            onIsPasswordValid={setIsPasswordValid}
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
          <DevPanel
            devVisible={devVisible}
            setDevVisible={setDevVisible}
            button1Function={setDevButton1}
            button2Function={setDevButton2}
            button3Function={setDevButton3}
            button4Function={setDevButton4}
            button5Function={setDevButton5}
          />
          <LogoutModal
            isOpened={activeModal === "logoutmodal" && "modal_opened"}
            onLogout={handleLogout}
            onCloseClick={closeActiveModal}
          />
          <button className="deletetokenbutton" onClick={deleteToken}>
            Delete Token
          </button>
        </CurrentTemperatureUnitContext.Provider>
      </CurrentUserContext.Provider>
    </div>
  );
}

export default App;
