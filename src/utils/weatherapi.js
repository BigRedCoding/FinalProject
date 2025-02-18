export const getWeather = ({ latitude, longitude }, APIkey) => {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitudeGps = position.coords.latitude;
          const longitudeGps = position.coords.longitude;

          getWeather2(
            { latitude: latitudeGps, longitude: longitudeGps },
            APIkey
          )
            .then(resolve)
            .catch(reject);
        },
        (error) => {
          getWeather2({ latitude, longitude }, APIkey)
            .then(resolve)
            .catch(reject);
        }
      );
    } else {
      getWeather2({ latitude, longitude }, APIkey).then(resolve).catch(reject);
    }
  });
};

export const getWeather2 = ({ latitude, longitude }, APIkey) => {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=imperial&appid=${APIkey}`;
  return fetch(url)
    .then((res) => {
      if (!res.ok) {
        return Promise.reject(`Error: ${res.status}`);
      }
      return res.json();
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};

export const filterWeatherData = (data) => {
  const result = {};

  result.city = data.name;
  result.temp = {
    F: Math.round(data.main.temp),
    C: Math.round(((data.main.temp - 32) * 5) / 9),
  };
  result.type = getWeatherType(result.temp.F);
  result.condition = data.weather[0].main.toLowerCase();
  result.isDay = isDay(data.sys, Date.now());

  return result;
};

const isDay = ({ sunrise, sunset }) => {
  const now = Date.now();
  return sunrise * 1000 < now && now < sunset * 1000;
};

export const getWeatherType = (temperature) => {
  if (temperature >= 86) {
    return "hot";
  } else if (temperature >= 66) {
    return "warm";
  } else {
    return "cold";
  }
};
