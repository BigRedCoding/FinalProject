const APIkey = "79c12449-d17c-44eb-a71c-66d07f1eff5b";

const fetchNewsFromPage = (pageNumber) => {
  const fromDate = "2025-02-01";

  return fetch(
    `https://content.guardianapis.com/search?from-date=${fromDate}&page=${pageNumber}&api-key=${APIkey}`
  )
    .then((response) => response.json())
    .then((data) => {
      const articles = data.response.results.map((item) => ({
        title: item.webTitle,
        url: item.webUrl,
        by: "The Guardian",
      }));

      return articles;
    })
    .catch((error) => {
      console.error("Error fetching page data:", error);
    });
};

export const getTheGuardianNews = () => {
  const pagePromises = [];

  for (let page = 1; page <= 5; page++) {
    pagePromises.push(fetchNewsFromPage(page));
  }

  return Promise.all(pagePromises).then((allPagesData) => {
    return allPagesData.flat();
  });
};
