const APIkey = "cur1abhr01qifa4srrc0cur1abhr01qifa4srrcg";

const fetchQuoteData = async (symbol) => {
  try {
    const response = await fetch(
      `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${APIkey}`
    );
    const data = await response.json();
    return data; // Return the fetched data
  } catch (error) {
    console.error("Error fetching data for symbol:", symbol, error);
    return null; // Return null in case of an error
  }
};

// Function to format the quote data into your desired format
const formatQuoteData = (symbol, data) => {
  if (!data || data.c === undefined || data.pc === undefined) {
    console.error("Invalid data for symbol:", symbol, data);
    return null; // Return null if data is invalid
  }

  const currentPrice = data.c; // Current price
  const previousClose = data.pc; // Previous close price
  const change = currentPrice - previousClose; // Change from previous close
  const percentChange = ((change / previousClose) * 100).toFixed(2); // Percent change

  return {
    symbol,
    currentPrice,
    change,
    percentChange,
  };
};

// Function to fetch and compile data for multiple symbols
export async function fetchAndDisplayData() {
  const symbols = [
    "BINANCE:BTCUSDT",
    "BINANCE:ETHUSDT",
    "AAPL", // AAPL stock
    "MSFT", // MSFT stock
    "AMZN", // AMZN stock
    "GOOG",
  ];

  const data = []; // Initialize an empty array to collect all formatted data

  // Loop through each symbol to fetch and format data
  for (let symbol of symbols) {
    const symbolData = await fetchQuoteData(symbol); // Fetch the data for the symbol
    if (symbolData) {
      const formattedData = formatQuoteData(symbol, symbolData); // Format the data
      if (formattedData) {
        data.push(formattedData); // Push the formatted data object into the array
      }
    }
  }

  return data; // Return the array with all formatted stock data
}
