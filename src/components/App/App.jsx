import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import { coordinates, APIKey } from "../../utils/constants.js";
import "./App.css";
import Header from "../header/Header.jsx";
import Main from "../Main/Main.jsx";

import Footer from "../footer/Footer.jsx";
import ItemModal from "../ItemModal/ItemModal.jsx";
import { getWeather, filterWeatherData } from "../../utils/weatherapi.js";
import CurrentTemperatureUnitContext from "../../contexts/CurrentTemperatureUnitContext.js";
import AddItemModal from "../AddItemModal/AddItemModal.jsx";
import DeleteModal from "../DeleteModal/DeleteModal.jsx";
import RegistrationModal from "../RegistrationModal/RegistrationModal.jsx";
import LoginModal from "../LoginModal/LoginModal.jsx";
import EditProfileModal from "../EditProfileModal/EditProfileModal.jsx";
import CurrentUserContext from "../../contexts/CurrentUserContext.js";

import ProtectedRoute from "../ProtectedRoute.jsx";

import {
  getItems,
  addItems,
  deleteItem,
  handleLoginUser,
  handleSignupUser,
  handleUpdateProfile,
  addCardLike,
  removeCardLike,
} from "../../utils/api.js";

function App() {
  const [weatherData, setWeatherData] = useState({
    type: "",
    temp: { F: 0, C: 0 },
    city: "",
    considtion: "",
    isDay: false,
  });
  const [activeModal, setActiveModal] = useState("");
  const [selectedCard, setSelectCard] = useState({});
  const [currentTemperatureUnit, setCurrentTemperatureUnit] = useState("F");
  const [clothingItems, setClothingItems] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState({});

  const [isPasswordValid, setIsPasswordValid] = useState(true);

  const [updateDOM, handleUpdateDOM] = useState(false);

  const handleAddClick = () => {
    setActiveModal("garment");
  };

  const handleDeleteClick = () => {
    setActiveModal("delete");
  };

  const closeActiveModal = () => {
    setActiveModal("");
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

  const handleCardClick = (card) => {
    setActiveModal("preview");
    setSelectCard(card);
  };

  const handleRegistrationClick = () => {
    setActiveModal("registration");
  };

  const handleLoginClick = () => {
    setActiveModal("login");
  };

  const handleEditProfileClick = () => {
    setActiveModal("editprofile");
  };

  const handleSetClothingItems = () => {
    getItems()
      .then((data) => {
        setClothingItems(data);
      })
      .catch(console.error);
  };

  const handleSetWeather = () => {
    getWeather(coordinates, APIKey)
      .then((data) => {
        const filteredData = filterWeatherData(data);

        setWeatherData(filteredData);
      })
      .catch(console.error);
  };

  const handleToggleSwitchChange = () => {
    setCurrentTemperatureUnit(currentTemperatureUnit === "F" ? "C" : "F");
  };

  const handleAddItemModalSubmit = ({ name, link, weatherType }) => {
    const newItem = {
      name: name,
      weather: weatherType,
      link: link,
      owner: userData.userId,
      likes: [],
    };
    addItems(newItem)
      .then((data) => {
        const item = data.data;
        setClothingItems((prevItems) => [item, ...prevItems]);
        handleUpdateDOM(!updateDOM);
        closeActiveModal();
      })
      .catch(console.error);
  };

  const handleDeleteCard = () => {
    const cardId = selectedCard._id;
    deleteItem(cardId)
      .then(() => {
        setClothingItems((prevItems) =>
          prevItems.filter((item) => item._id !== cardId)
        );
        setSelectCard({});
        closeActiveModal();
        handleUpdateDOM(!updateDOM);
      })
      .catch(console.error);
  };

  const handleCardLike = (id, isLiked) => {
    const token = localStorage.getItem("jwt");

    if (!token) {
      console.log("User is not authenticated.");
      return;
    }
    if (!isLiked) {
      addCardLike(id, token)
        .then(() => {
          setClothingItems((cards) =>
            cards.map((item) =>
              item._id === id
                ? { ...item, likes: [...item.likes, userData.userId] }
                : item
            )
          );
        })
        .catch((err) => console.log("Error adding like:", err));
    } else {
      removeCardLike(id, token)
        .then(() => {
          setClothingItems((cards) =>
            cards.map((item) =>
              item._id === id
                ? {
                    ...item,
                    likes: item.likes.filter((id) => id !== userData.userId),
                  }
                : item
            )
          );
        })
        .catch((err) => console.log("Error removing like:", err));
    }
  };

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
    handleSetClothingItems();
    handleSetWeather();
    updateContext();
    handleUpdateDOM(!updateDOM);
  }, []);

  useEffect(() => {
    handleUpdateDOM(!updateDOM);
  }, [weatherData]);
  return (
    <div className="page">
      <CurrentUserContext.Provider
        value={{
          isLoggedIn,
          userData,
          isPasswordValid,
          clothingItems,
          weatherData,
          updateDOM,
        }}
      >
        <CurrentTemperatureUnitContext.Provider
          value={{ currentTemperatureUnit, handleToggleSwitchChange }}
        >
          <div className="page__content">
            <Header
              onAddClick={handleAddClick}
              onLoginClick={handleLoginClick}
              onRegistrationClick={handleRegistrationClick}
            />
            <Routes>
              <Route
                path="/"
                element={
                  <Main
                    clothingItems={clothingItems}
                    onCardClick={handleCardClick}
                    onCardLike={handleCardLike}
                    weatherData={weatherData}
                  />
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <Footer />
          </div>

          <AddItemModal
            activeModal={activeModal}
            onCloseClick={closeActiveModal}
            isOpened={activeModal === "garment" && "modal_opened"}
            onAddItemModalSubmit={handleAddItemModalSubmit}
          />
          <ItemModal
            selectedCard={selectedCard}
            onCloseClick={closeActiveModal}
            isOpened={activeModal === "preview" && "modal_opened"}
            onDeleteClick={handleDeleteClick}
          />
          <DeleteModal
            onCloseClick={closeActiveModal}
            isOpened={activeModal === "delete" && "modal_opened"}
            onDeleteCard={handleDeleteCard}
          />
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
        </CurrentTemperatureUnitContext.Provider>
      </CurrentUserContext.Provider>
    </div>
  );
}

export default App;
