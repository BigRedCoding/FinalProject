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
import { getGnewsNews } from "../../utils/NewsApis/Gnews.js";
import { searchArticles } from "../../utils/NewsApis/newsapp.js";

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
  const [hasPulledServerArticles, setHasPulledServerArticles] = useState(false);

  const [articlesTotal, setArticlesTotal] = useState([]);

  const [activeModal, setActiveModal] = useState("");

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(true);

  const [isProfileSelected, setIsProfileSelected] = useState("home");

  const [currentSearchDataMain, setCurrentSearchDataMain] = useState([]);

  const [searchText, setSearchText] = useState("");

  //Dev Variables
  const [startApiTrigger, setStartApiTrigger] = useState(false);

  //Account variables
  const [userData, setUserData] = useState({});

  //Basic Functions
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

  //Dev
  const [devVisible, setDevVisible] = useState("isHidden");
  const setDevPanelVisibility = () => {
    setDevVisible();
  };

  const setDevButton1 = () => {};
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
          currentSearchDataMain,
          setCurrentSearchDataMain,
          searchText,
          setSearchText,
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
                    articlesTotal={articlesTotal}
                  />
                }
              />
              <Route
                path="/liked-by-server"
                element={
                  <LikedByServer
                    onLoginClick={handleLoginClick}
                    onRegistrationClick={handleRegistrationClick}
                    setIsProfileSelected={setIsProfileSelected}
                    onEditProfileClick={handleEditProfileClick}
                    onLogoutClick={handleLogoutClick}
                    isProfileSelected={isProfileSelected}
                    onArticleLike={handleArticleLike}
                    onArticleFavorite={handleArticleFavorite}
                    articlesTotal={articlesTotal}
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
                      setIsProfileSelected={setIsProfileSelected}
                      onEditProfileClick={handleEditProfileClick}
                      onLogoutClick={handleLogoutClick}
                      isProfileSelected={isProfileSelected}
                      onArticleLike={handleArticleLike}
                      onArticleFavorite={handleArticleFavorite}
                      articlesTotal={articlesTotal}
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
