import "./About.css";

import selfImage from "../../assets/selfstand.jpg";
import cdaImage from "../../assets/cdalake.jpg";

export default function About() {
  return (
    <section className="about">
      <img
        src={cdaImage}
        alt="Background image"
        className="about__background-image"
      />
      <div className="about__container">
        <div className="about__image-container">
          <img src={selfImage} alt="Image of author" className="about__image" />
        </div>

        <div className="about__details">
          <div className="about__details-container">
            <p className="about__author">About the author</p>
            <div className="about__image-container-mobile">
              <img
                src={selfImage}
                alt="Image of author"
                className="about__image-mobile"
              />
            </div>

            <p className="about__description">
              His name is Brandon Dooley. He is 35 years old, has earned two
              Bachelors in Communication Arts and one Bachelors in Management,
              and was previously a CDL Driver for five and a half years.
            </p>
            <p className="about__description">
              For many years, he freelanced practiced with Unreal Engine and
              Unity, but he knew he needed something more structure. In October,
              he chose to pursue Software Engineering through TripleTen. This
              site is his final project, and he hopes you enjoy the content.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
