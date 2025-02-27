const API_KEY = "c749e7cf07be40488b94750db2077fb9";

import axios from "axios";

const BASE_URL = "https://newsapi.org/v2";

const fetchNews = async (endpoint, params = {}) => {
  try {
    const response = await axios.get(`${BASE_URL}/${endpoint}`, {
      params: {
        ...params,
        apiKey: API_KEY,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching news:", error);
    return { error: "Error fetching news" };
  }
};

export const searchArticles = async (query, page) => {
  console.log("newsapi triggered");

  const params = { q: query, pageSize: 100, page };
  const data = await fetchNews("everything", params);

  return data.articles.map((article) => {
    const { author, title, description, urlToImage, url, source, publishedAt } =
      article;

    const date = new Date(publishedAt).getTime();

    const authorReconfig = author == null ? source.name : author;

    return {
      author: authorReconfig,
      title: title,
      description: description,
      imageUrl: urlToImage,
      url: url,
      source: source.name,
      date: date,
      apiname: "newsapp",
    };
  });
};
