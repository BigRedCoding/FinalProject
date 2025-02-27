import "./StockCard.css";

export default function StockCard({ itemData }) {
  const symbol = itemData.symbol.replace(/^BINANCE:/, "").replace(/USDT$/, "");
  const change = itemData.change.toFixed(2);
  const currentPrice = itemData.currentPrice.toFixed(2);

  return (
    <li className="stock-card">
      <div className="stock-card__title-price">
        <p className="stock-card__title">{symbol}</p>
        <p className="stock-card__price">{currentPrice}</p>
      </div>
      <div className="stock-card__change-percent">
        <p
          className={`stock-card__percent ${
            itemData.percentChange > 0 ? "green" : "red"
          }`}
        >
          <span
            className={`arrow ${itemData.percentChange > 0 ? "green" : "red"}`}
          >
            {itemData.percentChange > 0 ? "↑" : "↓"}
          </span>
          {itemData.percentChange}%
        </p>
        <p className="stock-card__change">({change})</p>
      </div>
    </li>
  );
}
