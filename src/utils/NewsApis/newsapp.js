const API_KEY = "c749e7cf07be40488b94750db2077fb9";

const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://nomoreparties.co/news/v2/"
    : "https://newsapi.org/v2/";

const fetchNews = async (endpoint, params) => {
  const url = new URL(`${BASE_URL}/${endpoint}`);
  const searchParams = new URLSearchParams(params);

  searchParams.append("apiKey", API_KEY);
  url.search = searchParams.toString();

  return new Promise((resolve, reject) => {
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error fetching data: ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => resolve(data))
      .catch((error) => {
        console.error("Error fetching news:", error);
        reject({ error: "Error fetching news" });
      });
  });
};

export const searchArticles = async (query, page) => {
  console.log("newsapi triggered");

  const params = { q: query, pageSize: 100, page };
  const data = await fetchNews("everything", params);

  return data.articles.map((article) => {
    const { author, title, description, urlToImage, url, source, publishedAt } =
      article;

    const date = new Date(publishedAt).getTime();

    const authorReconfig =
      author === null || author === "" ? source.name : author;

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
