const APIkey = "cur1abhr01qifa4srrc0cur1abhr01qifa4srrcg";

const fetchQuoteData = async (symbol) => {
  try {
    const response = await fetch(
      `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${APIkey}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data for symbol:", symbol, error);
    return null;
  }
};

const formatQuoteData = (symbol, data) => {
  if (!data || data.c === undefined || data.pc === undefined) {
    console.error("Invalid data for symbol:", symbol, data);
    return null;
  }

  const currentPrice = data.c;
  const previousClose = data.pc;
  const change = currentPrice - previousClose;
  const percentChange = ((change / previousClose) * 100).toFixed(2);

  return {
    symbol,
    currentPrice,
    change,
    percentChange,
  };
};

export async function fetchAndDisplayData() {
  const symbols = [
    "BINANCE:BTCUSDT",
    "BINANCE:ETHUSDT",
    "AAPL",
    "MSFT",
    "AMZN",
    "GOOG",
  ];

  const data = [];

  for (let symbol of symbols) {
    const symbolData = await fetchQuoteData(symbol);
    if (symbolData) {
      const formattedData = formatQuoteData(symbol, symbolData);
      if (formattedData) {
        data.push(formattedData);
      }
    }
  }

  return data;
}
