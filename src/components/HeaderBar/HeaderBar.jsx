import "./HeaderBar.css";
import React, { useEffect, useState, useRef } from "react";
import { getHackerNews } from "../../utils/NewsApis/hackernewsapi";
import { getTheGuardianNews } from "../../utils/NewsApis/theguardian";
import HeaderBarCard from "../HeaderBarCard/HeaderBarCard";

export default function HeaderBar() {
  const [loading, setLoading] = useState(true);
  const [apiTrigger, setApiTrigger] = useState(true);

  const [dataScroll, setDataScroll] = useState([]);
  const scrollContainerRef = useRef(null);
  const translateValue = useRef(0);

  const shuffleArray = (array) => {
    let shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [
        shuffledArray[j],
        shuffledArray[i],
      ];
    }
    return shuffledArray;
  };

  const combineAndRandomizeData = (newsData, newsData2) => {
    const combinedArray = [...newsData, ...newsData2];
    const randomizedArray = shuffleArray(combinedArray);
    addItems(randomizedArray);
  };

  const addItems = (randomizedArray) => {
    if (randomizedArray.length > 0) {
      const initialData = randomizedArray.map((item, index) => (
        <HeaderBarCard key={index} data={item} />
      ));
      setDataScroll(initialData);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    const data = await getHackerNews();
    const data2 = await getTheGuardianNews();

    setLoading(false);
    combineAndRandomizeData(data, data2);
  };

  useEffect(() => {
    if (apiTrigger === true) {
      fetchData();
      setApiTrigger(false);
    }
  }, []);

  useEffect(() => {
    let intervalId;

    const startScrolling = () => {
      intervalId = setInterval(() => {
        if (scrollContainerRef.current) {
          const containerWidth = scrollContainerRef.current.width;
          translateValue.current -= 1;
          scrollContainerRef.current.style.transform = `translateX(${translateValue.current}px)`;

          if (translateValue.current <= -containerWidth) {
            clearInterval(intervalId);
            setTimeout(() => {
              translateValue.current = 0;
            }, 2000);
          }
        }
      }, 20);
    };

    startScrolling();

    return () => clearInterval(intervalId);
  }, [dataScroll]);

  return (
    <div className="header-bar">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="header-bar__news-scroll">
          <ul className="header-bar__data-scroll" ref={scrollContainerRef}>
            {dataScroll}
          </ul>
        </div>
      )}
    </div>
  );
}
