export const weatherConditions = [
  {
    day: true,
    condition: "clear",
    url: new URL("../assets/ClearDay.svg", import.meta.url).href,
  },
  {
    day: true,
    condition: "clouds",
    url: new URL("../assets/CloudyDay.svg", import.meta.url).href,
  },
  {
    day: true,
    condition: "fog",
    url: new URL("../assets/FoggyDay.svg", import.meta.url).href,
  },
  {
    day: true,
    condition: "rain",
    url: new URL("../assets/RainyDay.svg", import.meta.url).href,
  },
  {
    day: true,
    condition: "thunderstorm",
    url: new URL("../assets/StormyDay.svg", import.meta.url).href,
  },
  {
    day: true,
    condition: "snow",
    url: new URL("../assets/SnowyDay.svg", import.meta.url).href,
  },
  {
    day: false,
    condition: "clear",
    url: new URL("../assets/ClearNight.svg", import.meta.url).href,
  },
  {
    day: false,
    condition: "clouds",
    url: new URL("../assets/CloudyNight.svg", import.meta.url).href,
  },
  {
    day: false,
    condition: "fog",
    url: new URL("../assets/FoggyNight.svg", import.meta.url).href,
  },
  {
    day: false,
    condition: "rain",
    url: new URL("../assets/RainyNight.svg", import.meta.url).href,
  },
  {
    day: false,
    condition: "thunderstorm",
    url: new URL("../assets/StormyNight.svg", import.meta.url).href,
  },
  {
    day: false,
    condition: "snow",
    url: new URL("../assets/SnowyNight.svg", import.meta.url).href,
  },
];

export const weatherConditions2 = [
  {
    code: [0],
    condition: "Clear",
    url: new URL("../assets/newSunny.png", import.meta.url).href,
  },
  {
    code: [1, 2, 3],
    condition: "Overcast",
    url: new URL("../assets/newPartlyCloudy.png", import.meta.url).href,
  },
  {
    code: [45, 48],
    condition: "Foggy",
    url: new URL("../assets/newFoggy.png", import.meta.url).href,
  },
  {
    code: [51, 53, 55],
    condition: "Drizzle",
    url: new URL("../assets/newDrizzle.png", import.meta.url).href,
  },
  {
    code: [56, 57],
    condition: "Freezing drizzle",
    url: new URL("../assets/newFreezingDrizzle.png", import.meta.url).href,
  },
  {
    code: [61, 63, 65, 80, 81, 82],
    condition: "Rain",
    url: new URL("../assets/newRain.png", import.meta.url).href,
  },
  {
    code: [66, 67],
    condition: "Freezing-rain",
    url: new URL("../assets/newFreezingRain.png", import.meta.url).href,
  },
  {
    code: [71, 73, 75, 77],
    condition: "Snow fall",
    url: new URL("../assets/newSnow.png", import.meta.url).href,
  },
  {
    code: [85, 86],
    condition: "Snow showers",
    url: new URL("../assets/newSnowShowers.png", import.meta.url).href,
  },
];

export const defaultWeatherOptions = {
  day: {
    day: true,
    url: new URL("../assets/defaultDay.png", import.meta.url).href,
    condition: "",
  },
  night: {
    day: false,
    url: new URL("../assets/defaultNight.png", import.meta.url).href,
    condition: "",
  },
};

export const coordinates = {
  latitude: "38.926575",
  longitude: "-77.083472",
};

export const WeatherAPIKey = "92198934837100f1596312e6135fc6c9";
