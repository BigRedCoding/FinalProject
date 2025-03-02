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

  const [hasCombinedList, setHasCombinedList] = useState(false);

  const [articlesLiked, setArticlesLiked] = useState([]);
  const [articlesFavorited, setArticlesFavorited] = useState([]);
  const [articlesTotal, setArticlesTotal] = useState([]);

  const [activeModal, setActiveModal] = useState("");

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(true);

  const [isProfileSelected, setIsProfileSelected] = useState("home");

  const [currentSearchDataMain, setCurrentSearchDataMain] = useState([]);

  const [searchText, setSearchText] = useState("");

  const [trigger, setTrigger] = useState(false);

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
  const combineFavoritesAndLikes = (totalArticles) => {
    const uniqueArticles = new Set();

    const filteredArticles = totalArticles.filter((article) => {
      const articleIdentifier = `${article.author}|${article.title}|${article.imageUrl}|${article.url}|${article.source}|${article.date}`;

      if (uniqueArticles.has(articleIdentifier)) {
        return false;
      }

      uniqueArticles.add(articleIdentifier);
      return true;
    });

    setArticlesTotal(filteredArticles);
  };

  const addLikedOrFavoriteFromArticles = (articleData, addWhich) => {
    const articleMatchCriteria = (article) =>
      article.author === articleData.author &&
      article.title === articleData.title &&
      article.imageUrl === articleData.imageUrl &&
      article.url === articleData.url &&
      article.source === articleData.source &&
      article.date === articleData.date;

    const addUserIdToLikes = (article, userId) => {
      const updatedLikes = article.likes.includes(userId)
        ? article.likes
        : [...article.likes, userId];
      return { ...article, likes: updatedLikes };
    };

    const addUserIdToFavorites = (article, userId) => {
      const updatedFavorites = article.favorites.includes(userId)
        ? article.favorites
        : [...article.favorites, userId];
      return { ...article, favorites: updatedFavorites };
    };

    const updateArticles = (articles, userId) => {
      if (!Array.isArray(articles)) return [];
      return articles.map((article) => {
        if (addWhich === "like") {
          if (articleMatchCriteria(article)) {
            return addUserIdToLikes(article, userId);
          }
        } else if (addWhich === "favorite") {
          return addUserIdToFavorites(article, userId);
        }
        return article;
      });
    };

    const updatedArticles = updateArticles(articlesTotal, userData.userId);

    console.log("add like function");

    combineFavoritesAndLikes(updatedArticles);
  };

  const removeLikeorFavoriteFromArticles = (articleData, removeWhich) => {
    const removeUserIdFromLikes = (article, userId) => {
      const updatedLikes = article.likes.filter((likes) => likes !== userId);
      return { ...article, likes: updatedLikes };
    };

    const removeUserIdFromFavorites = (article, userId) => {
      const updatedFavorites = article.favorites.filter(
        (favorites) => favorites !== userId
      );
      return { ...article, favorites: updatedFavorites };
    };

    const updateArticles = (articles, userId) => {
      if (!Array.isArray(articles)) return [];
      return articles
        .map((article) => {
          if (removeWhich === "like") {
            if (article === articleData) {
              const updatedArticle = removeUserIdFromLikes(article, userId);

              if (
                updatedArticle.likes.length === 0 &&
                updatedArticle.favorites === 0
              ) {
                return null;
              }
              return updatedArticle;
            }
          } else if (removeWhich === "favorite") {
            const updatedArticle = removeUserIdFromFavorites(article, userId);

            if (updatedArticle.favorites === 0) {
              return null;
            }
            return updatedArticle;
          }
          return article;
        })
        .filter((article) => article !== null);
    };

    const updatedArticles = updateArticles(articlesTotal, userData.userId);

    combineFavoritesAndLikes(updatedArticles);
  };

  const handleSetLikedArticles = () => {
    getArticlesByLikes()
      .then((data) => {
        return setArticlesLiked(data);
      })
      .catch(console.error);
  };

  const handleSetFavoriteArticles = () => {
    const token = localStorage.getItem("jwt");

    if (token) {
      getArticlesByFavorite(token)
        .then((data) => {
          return setArticlesFavorited(data);
        })
        .catch(console.error);
    }
  };

  const handleArticleLike = (isLiked, articleData) => {
    const token = localStorage.getItem("jwt");
    const functionName = "like";

    if (!token) {
      console.log("User is not authenticated.");
      return;
    }

    if (!isLiked) {
      addLike(token, articleData)
        .then(() => {
          addLikedOrFavoriteFromArticles(articleData, functionName);
        })
        .catch((err) => console.log("Error adding like:", err));
    } else {
      removeLike(token, articleData)
        .then(() => {
          removeLikeorFavoriteFromArticles(articleData, functionName);
        })
        .catch((err) => console.log("Error removing like:", err));
    }
  };

  const handleArticleFavorite = (isFavorited, articleData) => {
    const token = localStorage.getItem("jwt");
    const functionName = "favorite";

    if (!token) {
      console.log("User is not authenticated.");
      return;
    }
    if (!isFavorited) {
      addFavorite(token, articleData)
        .then(() => {
          addLikedOrFavoriteFromArticles(articleData, functionName);
        })
        .catch((err) => console.log("Error adding favorite:", err));
    } else {
      removeFavorite(token, articleData)
        .then(() => {
          removeLikeorFavoriteFromArticles(articleData, functionName);
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
    if (!hasCombinedList) {
      {
        combineFavoritesAndLikes(articlesTotal);
        setHasCombinedList(true);
      }
    }
  }, [articlesTotal]);

  useEffect(() => {
    if (articlesLiked?.length > 0 || articlesFavorited?.length > 0) {
      const updatedList = [...articlesLiked, ...articlesFavorited];

      setArticlesTotal(updatedList);

      setHasCombinedList(false);
    }
  }, [articlesLiked, articlesFavorited]);

  useEffect(() => {
    if (!hasPulledServerArticles) {
      handleSetLikedArticles();

      handleSetFavoriteArticles();

      handleSetWeather();
      updateContext();
      setHasPulledServerArticles(true);

      console.log("pulled articles");
    }
  }, []);

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
                    setIsProfileSelected={setIsProfileSelected}
                    onEditProfileClick={handleEditProfileClick}
                    onLogoutClick={handleLogoutClick}
                    isProfileSelected={isProfileSelected}
                    onArticleLike={handleArticleLike}
                    onArticleFavorite={handleArticleFavorite}
                    onSetLikedArticles={handleSetLikedArticles}
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
                      setIsProfileSelected={setIsProfileSelected}
                      onEditProfileClick={handleEditProfileClick}
                      onLogoutClick={handleLogoutClick}
                      isProfileSelected={isProfileSelected}
                      onArticleLike={handleArticleLike}
                      onArticleFavorite={handleArticleFavorite}
                      onSetFavoriteArticles={handleSetFavoriteArticles}
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
