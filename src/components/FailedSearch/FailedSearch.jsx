import "./FailedSearch.css";
import FailedSearchImage from "../../assets/not-found_v1.svg";

export default function FailedSearch() {
  return (
    <div className="failed-search">
      <div className="failed-search__container">
        <img
          src={FailedSearchImage}
          alt="Not found image"
          className="failed-search__image"
        />
        <h2 className="failed-search__title">Nothing Found</h2>
        <p className="failed-search__text">
          Sorry, but nothing matched your search terms.
        </p>
      </div>
    </div>
  );
}
