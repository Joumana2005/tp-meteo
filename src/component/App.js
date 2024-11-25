import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFrown, faStar } from '@fortawesome/free-solid-svg-icons';
import { Oval } from 'react-loader-spinner';
import './App.css';

function Grp204WeatherApp() {
  const [input, setInput] = useState('');
  const [weather, setWeather] = useState({ loading: false, data: {}, error: false });
  const [forecast, setForecast] = useState([]);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
    setFavorites(savedFavorites);
  }, []);

  const saveToFavorites = (city) => {
    if (!favorites.includes(city)) {
      const updatedFavorites = [...favorites, city];
      setFavorites(updatedFavorites);
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    }
  };

  const toDateFunction = () => {
    const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    const WeekDays = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    const currentDate = new Date();
    return `${WeekDays[currentDate.getDay()]} ${currentDate.getDate()} ${months[currentDate.getMonth()]}`;
  };

  const search = async (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      setInput('');
      setWeather({ ...weather, loading: true });
      const url = 'https://api.openweathermap.org/data/2.5/weather';
      const api_key = 'f00c38e0279b7bc85480c3fe775d518c';
      
      try {
        const weatherResponse = await axios.get(url, {
          params: { q: input, units: 'metric', appid: api_key },
        });
        setWeather({ data: weatherResponse.data, loading: false, error: false });
        saveToFavorites(input);
        
        const forecastResponse = await axios.get('https://api.openweathermap.org/data/2.5/forecast', {
          params: { q: input, units: 'metric', appid: api_key },
        });
        setForecast(forecastResponse.data.list.slice(0, 5));
      } catch (error) {
        setWeather({ ...weather, data: {}, error: true });
        setInput('');
      }
    }
  };

  return (
    <div className="App">
      <h1 className="app-name">Application Météo grp204</h1>
      <div className="search-bar">
        <input
          type="text"
          className="city-search"
          placeholder="Entrez le nom de la ville..."
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyPress={search}
        />
        <button onClick={() => saveToFavorites(input)}><FontAwesomeIcon icon={faStar} /></button>
      </div>
      
      <div className="favorites">
        <h3>Villes favorites</h3>
        <ul>
          {favorites.map((city, index) => (
            <li key={index} onClick={() => setInput(city)}>{city}</li>
          ))}
        </ul>
      </div>

      {weather.loading && <Oval color="black" height={100} width={100} />}
      
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
          <img src={`https://openweathermap.org/img/wn/${weather.data.weather[0].icon}@2x.png`} alt={weather.data.weather[0].description} />
          <p>{Math.round(weather.data.main.temp)}°C</p>
          <p>Vitesse du vent : {weather.data.wind.speed} m/s</p>
          
          <div className="forecast">
            <h3>Prévisions sur 5 jours</h3>
            <ul>
              {forecast.map((day, index) => (
                <li key={index}>
                  <p>{new Date(day.dt_txt).toLocaleDateString()}</p>
                  <img src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`} alt={day.weather[0].description} />
                  <p>{Math.round(day.main.temp)}°C</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default Grp204WeatherApp;
