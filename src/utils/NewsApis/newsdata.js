import axios from "axios";

const fetchNews = async (query) => {
  try {
    const response = await axios.get(
      `https://newsdata.io/api/1/latest?apikey=pub_709541bd6fd875ebc3a7523e9474621c40889&q=${query}&language=en`
    );

    const formattedReturnData = response.data.results.map((article) => {
      const date = new Date(article.pubDate).getTime();

      // Handle the 'creator' field to ensure it's a string
      const author = Array.isArray(article.creator)
        ? article.creator.join(", ")
        : article.creator || "";

      return {
        author: author,
        title: article.title,
        description: article.description,
        imageUrl: article.image_url,
        url: article.link,
        source: article.source_name,
        date: date,
        apiname: "newsdata",
      };
    });

    return formattedReturnData;
  } catch (error) {
    console.error("Error fetching news:", error);
    return { error: "Error fetching news" };
  }
};

export const getNewsData = async (query) => {
  console.log("NewsData triggered");
  const dataArray = await fetchNews(query);

  return dataArray;
};
