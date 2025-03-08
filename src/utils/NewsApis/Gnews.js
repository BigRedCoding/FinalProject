const APIkey = "d255de69a9fc677688f627dd896b2e92";
const BASE_URL = "https://gnews.io/api/v4/search?";

const convertToTimestamp = (dateString) => new Date(dateString).getTime();

const fetchNews = (query) => {
  return new Promise((resolve, reject) => {
    fetch(`${BASE_URL}${query}&lang=en&country=us&max=10&apikey=${APIkey}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error fetching data: ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        const formattedNews = data.articles.map((item) => ({
          author: item.source.name,
          title: item.title,
          description: item.description,
          imageUrl: item.image,
          url: item.url,
          source: item.source.name,
          date: convertToTimestamp(item.publishedAt),
          apiname: "gnews",
        }));
        resolve(formattedNews);
      })
      .catch((error) => {
        console.error("Error fetching news:", error);
        reject([]);
      });
  });
};

export const getGnewsNews = (query) => {
  console.log("GNews triggered");

  const formattedQuery = query?.replace(/\s+/g, "&") || "";

  const search = `q=${formattedQuery}`;

  return fetchNews(search);
};
