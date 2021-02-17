export const weatherService = {
  getWeather,
};

const WEATHER_API_KEY = 'b3814dd3cd39a83ae35d8c8be4835ac5';

function getWeather(lat, lng) {
  console.log(location);
  return axios
    .get(
      `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&APPID=${WEATHER_API_KEY}`
    )
    .then((res) => {
      console.log('Service Got Res:', res);
      const weatherData = {
        desc: res.data.weather[0].description,
        temp: Math.round(res.data.main.temp),
        feelsLike: Math.round(res.data.main.feels_like),
      };
      console.log(weatherData);
      return weatherData;
    })
    .catch((err) => {
      console.log('Service got Error:', err);
    });
}
