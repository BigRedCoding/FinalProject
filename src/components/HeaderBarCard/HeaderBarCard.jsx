import "./HeaderBarCard.css";

export default function HeaderBarCard({ data }) {
  const title = data?.title || "";
  const author = data?.by || "";
  const link = data?.url || "";

  return (
    <li>
      <div className="header-bar-card">
        <p className="header-bar-card__title">{title}</p>

        <p className="header-bar-card__author">By: {author}</p>

        <a
          href={link}
          className="header-bar-card__link"
          target="_blank"
          rel="noopener noreferrer"
        >
          open site
        </a>
      </div>
    </li>
  );
}
