const baseUrl =
  process.env.NODE_ENV === "production"
    ? "https://api.bdwtwr.justlearning.net/"
    : "http://localhost:3001";

import AvatarImage from "../assets/Avatar.svg";

export function responseCheck(res) {
  if (res.ok) {
    return res.json();
  }
  return res.json().then((error) => {
    return Promise.reject(`Error: ${error.message}`);
  });
}

export async function getItems() {
  return fetch(`${baseUrl}/items`)
    .then((res) => {
      return responseCheck(res);
    })
    .catch((error) => {
      console.error(error);
      return {
        link: AvatarImage,
        message: "Network error or invalid URL, using fallback image.",
      };
    });
}
export async function addItems(item) {
  const token = localStorage.getItem("jwt");
  return fetch(`${baseUrl}/items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(item),
  })
    .then((res) => {
      return responseCheck(res);
    })
    .catch((error) => {
      console.error(error);
      return Promise.reject(`Error: ${error.message}`);
    });
}

export async function deleteItem(itemId) {
  const token = localStorage.getItem("jwt");
  return fetch(`${baseUrl}/items/${itemId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => {
      return responseCheck(res);
    })
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.error(error);
      return Promise.reject(`Error: ${error.message}`);
    });
}

export async function handleLoginUser(userData) {
  return fetch(`${baseUrl}/signin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  })
    .then((res) => {
      return responseCheck(res);
    })
    .then((data) => {
      console.log("Login successful");

      if (data.token) {
        localStorage.setItem("jwt", data.token);
        localStorage.setItem("userData", JSON.stringify(data.userInfo));
      } else {
        console.error("No token received in response.");
        return Promise.reject(new Error("No token received."));
      }
    })
    .catch((error) => {
      console.error(error);
      return Promise.reject(`Error: ${error.message}`);
    });
}

export async function handleSignupUser(userData) {
  return fetch(`${baseUrl}/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  })
    .then((res) => {
      return responseCheck(res);
    })
    .catch((error) => {
      console.error(error);
      return Promise.reject(`Error: ${error.message}`);
    });
}

export async function handleUpdateProfile(userData) {
  const token = localStorage.getItem("jwt");

  fetch(`${baseUrl}/profile`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(userData),
  })
    .then((res) => {
      return responseCheck(res);
    })
    .then(() => {
      console.log("Updated profile successfully.");
    })
    .catch((error) => {
      console.error(error);
      return Promise.reject(`Error: ${error.message}`);
    });
}
export async function addCardLike(id, token) {
  return fetch(`${baseUrl}/items/${id}/likes`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      return responseCheck(res);
    })
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.error(error);
      return Promise.reject(`Error: ${error.message}`);
    });
}

export async function removeCardLike(id, token) {
  return fetch(`${baseUrl}/items/${id}/likes`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => {
      return responseCheck(res);
    })
    .catch((error) => {
      console.error(error);
      return Promise.reject(`Error: ${error.message}`);
    });
}
