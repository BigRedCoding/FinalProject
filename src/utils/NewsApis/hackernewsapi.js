import axios from "axios";

const BASE_URL =
  "https://hacker-news.firebaseio.com/v0/newstories.json?print=pretty";

const fetchNews = async () => {
  try {
    const response = await axios.get(`${BASE_URL}`);

    const responseArray = [];

    for (let i = 0; i < response.data.length; i++) {
      const responseid = response.data[i];

      responseArray.push(
        `https://hacker-news.firebaseio.com/v0/item/${responseid}.json?print=pretty`
      );
    }
    const dataPromises = responseArray.map((url) => axios.get(url));

    const dataResponses = await Promise.all(dataPromises);

    const fetchedData = dataResponses.map((dataResponse) => dataResponse.data);

    return fetchedData;
  } catch (error) {
    return { error: "Error fetching news", error };
  }
};

export const getHackerNews = async () => {
  return await fetchNews();
};
