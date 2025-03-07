function get7DayForecast(data) {
  const url = "https://api.open-meteo.com/v1/forecast";

  const currentLatitude = data?.latitude || "";
  const currentLongitude = data?.longitude || "";

  const params = {
    latitude: currentLatitude,
    longitude: currentLongitude,
    current: [
      "temperature_2m",
      "relative_humidity_2m",
      "is_day",
      "precipitation",
      "rain",
      "showers",
      "snowfall",
      "weather_code",
      "cloud_cover",
      "wind_speed_10m",
      "wind_direction_10m",
      "wind_gusts_10m",
    ],
    daily: [
      "weather_code",
      "temperature_2m_max",
      "temperature_2m_min",
      "sunrise",
      "sunset",
      "precipitation_sum",
      "rain_sum",
      "showers_sum",
      "precipitation_probability_max",
      "wind_speed_10m_max",
      "wind_gusts_10m_max",
      "wind_direction_10m_dominant",
      "shortwave_radiation_sum",
    ],
    wind_speed_unit: "mph",
    precipitation_unit: "inch",
    past_days: 1,
    forecast_days: 7,
  };
  if (data) {
    return fetch(`${url}?${new URLSearchParams(params)}`)
      .then((response) => response.json())
      .catch((error) => {
        console.error("Error fetching 7-day forecast:", error);
      });
  }
}

function generateWeatherData(data) {
  const daysData = [];

  const {
    precipitation_probability_max,
    precipitation_sum,
    rain_sum,
    shortwave_radiation_sum,
    showers_sum,
    sunrise,
    sunset,
    temperature_2m_max,
    temperature_2m_min,
    weather_code,
    wind_direction_10m_dominant,
    wind_gusts_10m_max,
    wind_speed_10m_max,
    time,
  } = data.daily;

  for (let i = 0; i < 7; i++) {
    const day = {
      date: time[i],
      precipitation_probability: precipitation_probability_max[i],
      precipitation_sum: precipitation_sum[i],
      rain_sum: rain_sum[i],
      shortwave_radiation_sum: shortwave_radiation_sum[i],
      showers_sum: showers_sum[i],
      sunrise: sunrise[i],
      sunset: sunset[i],
      temperature_max: temperature_2m_max[i],
      temperature_min: temperature_2m_min[i],
      weather_code: weather_code[i],
      wind_direction: wind_direction_10m_dominant[i],
      wind_gusts_max: wind_gusts_10m_max[i],
      wind_speed_max: wind_speed_10m_max[i],
    };

    daysData.push(day);
  }
  const currentData = data.current;

  const obtainedData = { daysData, currentData };

  return obtainedData;
}

const fetchWeatherData = (data) => {
  return get7DayForecast(data)
    .then((rawData) => generateWeatherData(rawData))
    .then((reconfiguredData) => reconfiguredData);
};

export default fetchWeatherData;
