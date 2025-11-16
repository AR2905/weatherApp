/* eslint-disable no-unused-vars */

import React, { useState, useEffect } from "react";
import { FaMapLocationDot, FaTemperatureLow } from "react-icons/fa6";
import "./my.css";
import { getTimeAndPeriod } from "./GetTime";
import BG1N from "../assets/night.jpg";
import BG2M from "../assets/morning.jpg";

import { callApi } from "../features/CallApi";
import {
  getWeatherConditionMorning,
  getWeatherConditionNight,
} from "../features/GetWeatherCondition";

const MainContainer = () => {
  const [searchVal, setSearch] = useState("mumbai");
  const [debouncedSearch, setDebouncedSearch] = useState(searchVal);
  const [city, setCity] = useState(null);
  const [temp, setTemp] = useState(0);
  const [tempclr, setTempclr] = useState("#3498db");
  const [cont, setCont] = useState("IN");
  const [icon, setIcon] = useState(
    "https://openweathermap.org/img/wn/09d@2x.png"
  );
  const [p, setP] = useState("");
  const [t, setT] = useState("");
  const [logo, setLogo] = useState(null);
  const [logoKey, setLogoKey] = useState(0);

  // 🕒 Debounce logic — wait 800ms after typing stops before triggering API
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchVal);
    }, 800);

    return () => {
      clearTimeout(handler);
    };
  }, [searchVal]);

  // 🌤️ Fetch weather data whenever debounced value changes
  useEffect(() => {
    const fetchApi = async () => {
      if (!debouncedSearch.trim()) return;
      try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${debouncedSearch}&appid=f678ae0debfc7ac533cd91ce8ab4c352`;
        const data = await callApi(url);
        setCity(data);
        setTemp((data.main.temp - 273.15).toFixed(2));
        setCont(data.sys.country);
        setIcon(
          `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
        );

        const { period, timeString } = getTimeAndPeriod(data.timezone);
        setP(period);
        setT(timeString);
      } catch (error) {
        console.error("Error fetching data:", error);
        setCity(null);
      }
    };

    fetchApi();
  }, [debouncedSearch]);

  useEffect(() => {
    if (city) {
      if (p === "Night") {
        setLogo(getWeatherConditionNight(city.weather[0].id));
      } else {
        setLogo(getWeatherConditionMorning(city.weather[0].id));
      }
      setLogoKey((prev) => prev + 1); // 👈 triggers re-render for animation
    }
  }, [p, city]);

  useEffect(() => {
    if (temp === 0) {
      setTempclr("#3498db");
    } else if (temp < 0) {
      setTempclr("#0000ff");
    } else if (temp < 10) {
      setTempclr("#3cadec");
    } else if (temp < 20) {
      setTempclr("#2ecc71");
    } else if (temp < 30) {
      setTempclr("#f39c12");
    } else if (temp < 40) {
      setTempclr("#e74c3c");
    }
  }, [temp]);

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-cover bg-center transition-all duration-700"
      style={{
        backgroundImage: p === "Night" ? `url(${BG1N})` : `url(${BG2M})`,
      }}
    >
      <div
        className="relative flex flex-col items-center justify-start p-6 rounded-2xl w-[90vw] max-w-[450px] bg-white/10 backdrop-blur-md border border-white/20 shadow-xl transition-all duration-500"
        style={{ borderColor: tempclr }}
      >
        {/* Search Bar */}
        <input
          type="search"
          className={`w-full p-3 mb-5 rounded-lg outline-none border transition-all ${p === "Night" ? "bg-white/20 text-white placeholder:text-gray-300 border-white/30 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300" : "bg-white/70 text-gray-900 placeholder:text-gray-600 border-gray-300 focus:border-gray-500 focus:ring-2 focus:ring-gray-400"}`}
          placeholder="Search for a city..."
          value={searchVal}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Weather Logo */}
        {city && city.cod === 200 ? (
          <img
            key={logoKey}
            src={logo || "/placeholder.svg"}
            alt="weather"
            className="h-28 w-28 object-contain mb-3 animate-fade-in"
          />
        ) : (
          <div className="h-28 mb-3"></div>
        )}

        {/* City Info */}
        {city && city.cod === 200 ? (
          <>
            <h1 className={`text-3xl font-bold drop-shadow-lg text-center ${p === "Night" ? "text-white" : "text-gray-900"}`}>
              {city.name} <span className="text-lg opacity-80">{cont}</span>
            </h1>

            {/* Temperature */}
            <div
              className="flex items-center justify-center mt-3 text-4xl font-semibold"
              style={{ color: tempclr }}
            >
              <FaTemperatureLow className="mr-2" />
              {temp}°C
            </div>

            {/* Description */}
            <div className="flex items-center justify-center mt-4 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg shadow-md">
              <img src={icon} alt="icon" className="w-8 h-8 mr-2" />
              <h2 className={`capitalize text-lg font-medium ${p === "Night" ? "text-white" : "text-gray-800"}`}>
                {city.weather[0].description}
              </h2>
            </div>

            {/* Extra Info */}
            <div className={`w-full mt-6 grid grid-cols-2 text-sm gap-3 ${p === "Night" ? "text-white" : "text-gray-800"}`}>
              <div className="bg-white/10 p-3 rounded-md">
                <p>💧 Humidity: {city.main.humidity}%</p>
                <p>👁 Visibility: {city.visibility} m</p>
              </div>
              <div className="bg-white/10 p-3 rounded-md text-right">
                <p>🌬 Wind: {city.wind.speed} m/s</p>
                <p>🧭 Direction: {city.wind.deg}°</p>
              </div>
            </div>

            {/* Footer Time */}
            <div className={`mt-5 text-sm ${p === "Night" ? "text-cyan-300" : "text-cyan-600"}`}>
              {p} • {t}
            </div>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-red-400 mt-6">
              No Data Found!
            </h1><div className="TempBox mt-4 text-center text-[1.5rem] font-bold text-white ">
              ...
            </div>
            <div className="Desc flex mt-8 justify-center bg-blue-300 items-center rounded-md">
              <div className="size-[2rem]"></div>
              <h1 className="inline-block text-black text-center text-xl"></h1>
            </div>

            <div className="moreinfo flex justify-between mt-4 mb-2 mx-2 text-white">
              <div className="humidity text-left ">
                <p className="mb-1"> --- </p>
                <p> --- </p>
              </div>

              <div className="wind text-right">
                <p className="mb-2"> --- </p>
                <p> --- </p>
              </div>
            </div>
            <div className="text-center text-blue-400 mb-2">--</div>
          </>
        )}
      </div>
    </div>
  );
};

export default MainContainer;
