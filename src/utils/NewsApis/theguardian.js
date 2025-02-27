const APIkey = "79c12449-d17c-44eb-a71c-66d07f1eff5b";

const fetchNewsFromPage = async (pageNumber) => {
  const fromDate = "2025-02-01";

  try {
    const response = await fetch(
      `https://content.guardianapis.com/search?from-date=${fromDate}&page=${pageNumber}&api-key=${APIkey}`
    );
    const data = await response.json();

    const articles = data.response.results.map((item) => ({
      title: item.webTitle,
      url: item.webUrl,
      by: "The Guardian",
    }));

    return articles;
  } catch (error) {
    console.error("Error fetching page data:", error);
  }
};

export const getTheGuardianNews = async () => {
  const allPagesData = [];

  for (let page = 1; page <= 5; page++) {
    const pageData = await fetchNewsFromPage(page);
    allPagesData.push(...pageData);
  }

  return allPagesData;
};
