import axios from "axios";

const APIkey = "d255de69a9fc677688f627dd896b2e92";

const BASE_URL = "https://gnews.io/api/v4/search?";

const convertToTimestamp = (dateString) => new Date(dateString).getTime();

const fetchNews = async (query) => {
  try {
    const response = await axios.get(
      `${BASE_URL}${query}&lang=en&country=us&max=10&apikey=${APIkey}`
    );

    const formattedNews = response.data.articles.map((item) => ({
      author: item.source.name,
      title: item.title,
      description: item.description,
      imageUrl: item.image,
      url: item.url,
      source: item.source.name,
      date: convertToTimestamp(item.publishedAt),
      apiname: "gnews",
    }));

    return [...formattedNews];
  } catch (error) {
    console.error("Error fetching news:", error);
    return [];
  }
};

export const getGnewsNews = async (query) => {
  console.log("GNews triggered");

  const search = `q=${query}`;

  const data = await fetchNews(search);

  return data;
};
