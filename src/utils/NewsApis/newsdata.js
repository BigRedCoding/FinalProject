const fetchNews = (query) => {
  return new Promise((resolve, reject) => {
    fetch(
      `https://newsdata.io/api/1/latest?apikey=pub_709541bd6fd875ebc3a7523e9474621c40889&q=${query}&language=en`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error fetching data: ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        const formattedReturnData = data.results.map((article) => {
          const date = new Date(article?.pubDate).getTime() || "";

          const author = Array.isArray(article?.creator)
            ? article?.creator.join(", ")
            : article?.creator || "";

          const authorReconfig =
            author === null || author === "" ? article?.source_name : author;

          return {
            author: authorReconfig,
            title: article?.title || "",
            description: article?.description || "",
            imageUrl: article?.image_url || "",
            url: article?.link || "",
            source: article?.source_name || "",
            date: date,
            apiname: "newsdata",
          };
        });
        resolve(formattedReturnData);
      })
      .catch((error) => {
        console.error("Error fetching news:", error);
        reject({ error: "Error fetching news" });
      });
  });
};

export const getNewsData = (query) => {
  console.log("NewsData triggered");
  return fetchNews(query);
};
