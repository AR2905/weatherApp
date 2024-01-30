

import React, { useState, useEffect } from "react";
import { FaMapLocationDot, FaTemperatureLow } from "react-icons/fa6";
import './my.css'
import { getTimeAndPeriod } from "./GetTime";
import BG1N from '../assets/night.jpg'
import BG2M from '../assets/morning.jpg'
import sun from '../assets/Morning/sky.png'
import scatter from '../assets/Morning/scatter.png'
import rain from '../assets/Morning/rain.png'
import mist from '../assets/Morning/mist.png'
import snow from '../assets/snow.png'
import slowRain from '../assets/slowRain.png'
import thunder from '../assets/thunder.png'
import sunN from '../assets/Night/sky.png'
import scatterN from '../assets/Night/scatter.png'
import rainN from '../assets/Night/rain.png'
import mistN from '../assets/Night/mist.png'


const MainContainer = () => {
  const [searchVal, setSearch] = useState("mumbai");
  const [city, setCity] = useState(null);
  const [temp, setTemp] = useState(0);
  const [tempclr, setTempclr] = useState("#3498db");
  const [cont , setCont] = useState("IN");
  const [icon, setIcon] = useState("https://openweathermap.org/img/wn/09d@2x.png");
  const [p , setP] = useState("")
  const [t, setT] = useState("")
  const [logo, setLogo] = useState(null)

  useEffect(() => {
    const fetchApi = async () => {
      try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${searchVal}&appid=f678ae0debfc7ac533cd91ce8ab4c352`;
        const response = await fetch(url);
        const data = await response.json();
        setCity(data);
        setTemp((data.main.temp - 273.15).toFixed(2));
        setCont(data.sys.country);
        setIcon(`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`);
        

        const { period, timeString } = getTimeAndPeriod(data.timezone);

        setP(period)
        setT(timeString)

  
      } catch (error) {
        console.error("Error fetching data:", error);
        setCity(null);
      }
    };
  
    fetchApi()
  }, [searchVal]);
  
  
  useEffect(() => {
    if (city) {
      if (p === "Night") {
        setLogo(getWeatherConditionNight(city.weather[0].id));
      } else {
        setLogo(getWeatherConditionMorning(city.weather[0].id));
      }
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



  const BorderStyle = {
    border: `8px solid ${tempclr}`,
    background: `rgba(19,19,148, 0.8)`,
    backdropFilter: `blur(8px)` 
  };

  const IconColor = `text-blue-500`;

  const MainBox = `w-[100vw] h-[100vh] flex flex-col justify-center items-center `;
  const InnerBox = `
    mx-auto inline-block
    border-l-8 border-r-8 border-b-8
    rounded-lg
    min-h-[45vh] w-[80vw]
    lg:min-h-[50vh] lg:w-[40vw]
  `;

  const SearchBar = `
    rounded-md mt-6 mx-auto p-2
    bg-blue-200
    border-2 shadow-md border-cyan-200 border-solid
    md:p-4
    focus:border-cyan-500 focus:shadow-lg  focus:outline-none
    w-[80%]
    
  `;

  const tempBox = `
    TempBox mt-4 text-center text-[1.5rem] font-bold text-white 
  `;

  const IconStyle = `
    size-24 opacity-30 ${IconColor}
  `;

  const HeadStyle = `
    text-3xl font-bold text-white
    border-t-8 border-r-8 border-l-8
    rounded-lg p-4
    bg-[#7dd3fc]
  `;

  function getWeatherConditionMorning(code) {

    if (code === 800 ) {
      return sun
    }

    const group = Math.floor(code / 100);

    switch (group) {
        case 2:
            return thunder;
        case 3:
            return slowRain;
        case 5:
            return rain;
        case 6:
            return snow;
        case 7:
            return mist;
        case 8:
            return scatter;
        default:
            return "Unknown";
    }
}
function getWeatherConditionNight(code) {

  if (code === 800 ) {
    return sunN
  }

  const group = Math.floor(code / 100);

  switch (group) {
      case 2:
          return thunder;
      case 3:
          return slowRain;
      case 5:
          return rainN;
      case 6:
          return snow;
      case 7:
          return mistN;
      case 8:
          return scatterN;
      default:
          return "Unknown";
  }
}

  

  return (
    <div className="body-boc"style={{backgroundImage: p === "Night" ? `url(${BG1N})` : `url(${BG2M})`}}>

    <div className={MainBox}>
    {city && city.cod === 200 ? 
      <img src={logo} alt="weather" className="max-h-[8rem] mb-4 slide-in-top" />
:
<div className="h-[8rem] mb-4" ></div>

    }

      <div className={InnerBox} style={BorderStyle}>
        <div className="searchContainer w-[100%] flex justify-center ">
          <input
            type="search"
            className={SearchBar}
            placeholder="Enter City..."
            value={searchVal}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {city && city.cod === 200 ? (
          <>
            <div className="location-box mt-[2rem] mx-auto flex justify-center items-center">
              <FaMapLocationDot className={IconStyle} />
              <h1 className="inline-block text-[2.25rem] font-bold text-white drop-shadow-xl absolute opacity-100">
                {city.name} <spann className = "text-[1rem]">{cont}</spann>
              </h1>
            </div>
            <div className={tempBox}>
              <FaTemperatureLow className=" inline-block mr-2 " />
              {temp}°C
            </div>
            <div className="Desc flex mt-8 justify-center bg-blue-300 items-center rounded-md">
              <img src={icon} alt="icon" className="size-[2rem]" />
              <h1 className="inline-block text-black text-center text-xl" >{city.weather[0].description}</h1>
            </div>

            <div className="moreinfo flex flex-col justify-between mt-4 mb-2 mx-2 text-white smed:flex-row ">
              <div className="humidity text-left ">
                <p className="mb-1"> Humidity : {city.main.humidity} </p>
                <p> Visibility : {city.visibility} meters </p>
              </div>
              
              <div className="wind text-left smed:text-right mt-2 smed:mt-0">
                <p className="mb-2"> Wind Speed : {city.wind.speed} m/s</p>
                <p> Wind Direction : {city.wind.deg}° </p>
              </div>
            </div>
            <div className="text-center text-blue-400 mb-2" >
              {p} {","}
              {t}
            </div>
          </>
        ) : (
          <>
            <div className="mt-[2rem] mx-auto flex justify-center items-center">
              <FaMapLocationDot className={IconStyle} />
              <h1 className="inline-block text-[2.25rem] font-bold drop-shadow-xl absolute text-red-400">
                No Data!
              </h1>
            </div>
            <div className="TempBox mt-4 text-center text-[1.5rem] font-bold text-white ">
              ...
            </div>
            <div className="Desc flex mt-8 justify-center bg-blue-300 items-center rounded-md">
              <div className="size-[2rem]" ></div>
              <h1 className="inline-block text-black text-center text-xl" ></h1>
            </div>

            <div className="moreinfo flex justify-between mt-4 mb-2 mx-2 text-white">
              <div className="humidity text-left ">
                <p className="mb-1">  --- </p>
                <p>  ---  </p>
              </div>
              
              <div className="wind text-right">
                <p className="mb-2">  --- </p>
                <p>  --- </p>
              </div>
            </div>
            <div className="text-center text-blue-400 mb-2" >
             --
            </div>
          </>
        )}
      </div>
      
    </div>
    </div>
  );
};

export default MainContainer;
