import "./HeaderBar.css";
import Avatar from "../../assets/Avatar.svg";

export default function HeaderBar() {
  return (
    <div className="header-bar">
      <img src={Avatar} alt="Avatar" className="header-bar__image" />
      <div className="header-bar__profile-details">
        <p className="header-bar__text">Brandon Dooley</p>
        <button className="header-bar__button">Change profile data</button>
        <button className="header-bar__button">Log out</button>
      </div>
    </div>
  );
}
