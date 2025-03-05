import "./HeaderBar.css";
import React, { useEffect, useState, useRef } from "react";
import { getHackerNews } from "../../utils/NewsApis/hackernewsapi";
import { getTheGuardianNews } from "../../utils/NewsApis/theguardian";
import HeaderBarCard from "../HeaderBarCard/HeaderBarCard";

export default function HeaderBar({ startApiTrigger, setStartApiTrigger }) {
  const [loading, setLoading] = useState(true);

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
    console.log("add items triggered");
    if (randomizedArray.length > 0) {
      const initialData = [];
      for (let i = 0; i < 5; i++) {
        initialData.push(
          <HeaderBarCard
            key={randomizedArray[i].id || i}
            data={randomizedArray[i]}
          />
        );
      }

      setDataScroll((prevData) => [...prevData, ...initialData]);

      let index = 5;
      const timer = setInterval(() => {
        if (index < randomizedArray.length) {
          const newCard = (
            <HeaderBarCard
              key={randomizedArray[index].id || index}
              data={randomizedArray[index]}
            />
          );
          setDataScroll((prevData) => [...prevData, newCard]);
          index += 1;
        } else {
          clearInterval(timer);
        }
      }, 5000);
    }
  };

  const fetchData = async () => {
    if (startApiTrigger === true) {
      console.log("fetchData triggered");
      setLoading(true);
      const data = await getHackerNews();
      const data2 = await getTheGuardianNews();
      console.log("fetchData pulled and set");
      setLoading(false);
      combineAndRandomizeData(data, data2);
      setStartApiTrigger(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [startApiTrigger]);

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
