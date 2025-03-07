const BASE_URL =
  "https://hacker-news.firebaseio.com/v0/newstories.json?print=pretty";

const fetchNews = () => {
  return new Promise((resolve, reject) => {
    fetch(`${BASE_URL}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error fetching data: ${response.statusText}`);
        }
        return response.json();
      })
      .then((responseArray) => {
        const responseUrls = responseArray.map(
          (responseid) =>
            `https://hacker-news.firebaseio.com/v0/item/${responseid}.json?print=pretty`
        );

        const dataPromises = responseUrls.map((url) => fetch(url));

        Promise.all(dataPromises)
          .then((dataResponses) =>
            Promise.all(
              dataResponses.map((dataResponse) => dataResponse.json())
            )
          )
          .then((fetchedData) => resolve(fetchedData))
          .catch((error) => reject({ error: "Error fetching news", error }));
      })
      .catch((error) => reject({ error: "Error fetching news", error }));
  });
};

export const getHackerNews = () => {
  return fetchNews();
};
