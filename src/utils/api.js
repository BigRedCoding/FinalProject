const baseUrl =
  process.env.NODE_ENV === "production"
    ? "https://api.bdwtwr.justlearning.net/"
    : "http://localhost:3001";

console.log("Base Server URL:", baseUrl);

export function responseCheck(res) {
  if (res.ok) {
    return res.json();
  }
  return res.json().then((error) => {
    return Promise.reject(`Error: ${error.message}`);
  });
}

export async function getArticlesByLikes() {
  return fetch(`${baseUrl}/articles/get-by-likes`)
    .then((res) => {
      return responseCheck(res);
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Error in fetching articles:", error);
    });
}

export async function getArticlesByFavorite(token) {
  return fetch(`${baseUrl}/articles/get-by-favorite`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      return responseCheck(res);
    })
    .catch((error) => {
      console.error(error);
    });
}

export async function addLike(token, articleData) {
  return fetch(`${baseUrl}/articles/articles-with-likes`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...articleData,
    }),
  })
    .then((res) => {
      return responseCheck(res);
    })
    .catch((error) => {
      console.error(error);
      return Promise.reject(`Error: ${error.message}`);
    });
}

export async function removeLike(token, articleData) {
  return fetch(`${baseUrl}/articles/articles-with-likes`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...articleData,
    }),
  })
    .then((res) => {
      return responseCheck(res);
    })
    .catch((error) => {
      console.error(error);
      return Promise.reject(`Error: ${error.message}`);
    });
}

export async function addFavorite(token, articleData) {
  return fetch(`${baseUrl}/articles/articles-with-favorites`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...articleData,
    }),
  })
    .then((res) => {
      return responseCheck(res);
    })
    .catch((error) => {
      console.error(error);
      return Promise.reject(`Error: ${error.message}`);
    });
}

export async function removeFavorite(token, articleData) {
  return fetch(`${baseUrl}/articles/articles-with-favorites`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...articleData,
    }),
  })
    .then((res) => {
      return responseCheck(res);
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

  fetch(`${baseUrl}/users/me`, {
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
