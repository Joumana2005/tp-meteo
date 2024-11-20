


import { Oval } from 'react-loader-spinner';
import React, { useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFrown } from '@fortawesome/free-solid-svg-icons';
import './App.css';

function Grp204WeatherApp() {
  const [input, setInput] = useState('');
  const [weather, setWeather] = useState({
    loading: false,
    data: {},
    forecast: [],
    error: false,
  });

  // Function to get the current date
  const toDateFunction = () => {
    const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    const WeekDays = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    const currentDate = new Date();
    const date = `${WeekDays[currentDate.getDay()]} ${currentDate.getDate()} ${months[currentDate.getMonth()]}`;
    return date;
  };

  // Function to fetch weather data and forecast
  const search = async (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      setInput('');
      setWeather({ ...weather, loading: true });

      const url = 'https://api.openweathermap.org/data/2.5/';
      const api_key = 'f00c38e0279b7bc85480c3fe775d518c';

      try {
        // Fetch current weather
        const currentWeatherResponse = await axios.get(`${url}weather`, {
          params: {
            q: input,
            units: 'metric',
            appid: api_key,
          },
        });

        // Fetch 5-day forecast
        const forecastResponse = await axios.get(`${url}forecast`, {
          params: {
            q: input,
            units: 'metric',
            appid: api_key,
          },
        });

        // Process forecast data to get daily temperatures
        const dailyForecast = processForecastData(forecastResponse.data.list);

        setWeather({
          data: currentWeatherResponse.data,
          forecast: dailyForecast,
          loading: false,
          error: false,
        });
      } catch (error) {
        setWeather({ ...weather, data: {}, forecast: [], error: true });
        setInput('');
      }
    }
  };

  // Function to process forecast data
  const processForecastData = (forecastList) => {
    const dailyData = [];
    for (let i = 0; i < forecastList.length; i += 8) {  // Every 8th element is the next day (24 hours = 8 entries of 3 hours each)
      const day = forecastList[i];
      const date = new Date(day.dt * 1000);
      dailyData.push({
        date: `${date.getDate()}/${date.getMonth() + 1}`,
        temp: Math.round(day.main.temp),
        icon: day.weather[0].icon,
        description: day.weather[0].description,
      });
    }
    return dailyData;
  };

  return (
    <div className="App">
      <h1 className="app-name">Application Météo grp204</h1>
      <div className="search-bar">
        <input
          type="text"
          className="city-search"
          placeholder="Entrez le nom de la ville..."
          name="query"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyPress={search}
        />
      </div>

      {weather.loading && (
        <Oval type="Oval" color="black" height={100} width={100} />
      )}

      {weather.error && (
        <span className="error-message">
          <FontAwesomeIcon icon={faFrown} />
          <span>Ville introuvable</span>
        </span>
      )}

      {weather.data && weather.data.main && (
        <div>
          <h2>{weather.data.name}, {weather.data.sys.country}</h2>
          <span>{toDateFunction()}</span>
          <img
            src={`https://openweathermap.org/img/wn/${weather.data.weather[0].icon}@2x.png`}
            alt={weather.data.weather[0].description}
          />
          <p>{Math.round(weather.data.main.temp)}°C</p>
          <p>Vitesse du vent : {weather.data.wind.speed} m/s</p>
        </div>
      )}

      {/* Weather forecast for the next 5 days */}
      <div className="forecast">
        <h3>Prévisions pour les 5 prochains jours :</h3>
        <div className="forecast-cards">
          {weather.forecast.map((day, index) => (
            <div className="forecast-card" key={index}>
              <span>{day.date}</span>
              <img
                src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
                alt={day.description}
              />
              <p>{day.temp}°C</p>
              <p>{day.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Grp204WeatherApp;


