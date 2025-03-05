import { attemptGainResponse } from "../utils/api.js";

const baseUrl =
  process.env.NODE_ENV === "production"
    ? "api.newsexplorer.justlearning.net"
    : "http://localhost:3001";

export function signup(item) {
  return fetch(`${baseUrl}/items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(item),
  })
    .then((res) => {
      return attemptGainResponse(res);
    })
    .then((data) => {
      return data;
    });
}

export function signin(item) {
  return fetch(`${baseUrl}/items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(item),
  })
    .then((res) => {
      return attemptGainResponse(res);
    })
    .then((data) => {
      return data;
    });
}
