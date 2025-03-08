import "./About.css";

import { useState, useEffect, useRef } from "react";

import { AboutBackgroundImages, selfImage } from "../../utils/constants.js";

export default function About() {
  const [initialTrigger, setInitialTrigger] = useState(false);

  const [backgroundImage, setBackgroundImage] = useState(
    AboutBackgroundImages[0]
  );
  const [backgroundImage2, setBackgroundImage2] = useState(
    AboutBackgroundImages[1]
  );
  const [transitionState, setTransitionState] = useState(
    "about-image_reset-position"
  );

  const [hidden, setHidden] = useState(true);
  const [hidden2, setHidden2] = useState(false);

  const currentIndexRef = useRef(0);

  const changeImage = () => {
    setTransitionState("about-image_slide-left");
    setHidden(false);
    setHidden2(false);
    const backgroundImagesLength = AboutBackgroundImages.length;
    setTimeout(() => {
      setHidden(true);
    }, 2300);

    setTimeout(() => {
      const nextImageRef =
        (currentIndexRef.current + 1) % backgroundImagesLength;
      setBackgroundImage2(AboutBackgroundImages[nextImageRef]);
      setTransitionState("about-image_reset-position");
    }, 2600);

    setTimeout(() => {
      if (currentIndexRef.current < backgroundImagesLength - 1) {
        currentIndexRef.current += 1;

        setBackgroundImage(AboutBackgroundImages[currentIndexRef.current]);
      } else {
        setBackgroundImage(AboutBackgroundImages[0]);
        currentIndexRef.current = 0;
      }
    }, 2000);
  };

  useEffect(() => {
    if (initialTrigger === false) {
      setBackgroundImage(AboutBackgroundImages[0]);
      const intervalId = setInterval(changeImage, 7000);
      setInitialTrigger(true);
      return () => clearInterval(intervalId);
    }
  }, []);
  return (
    <section className="about">
      <div className="about__background-image-container">
        <img
          src={backgroundImage}
          alt="Background image"
          className={`about__background-image current ${
            hidden2 ? "isHidden" : ""
          }`}
        />
        <img
          src={backgroundImage2}
          alt="Next background image"
          className={`about__background-image next ${transitionState} ${
            hidden ? "isHidden" : ""
          }`}
        />
      </div>

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
