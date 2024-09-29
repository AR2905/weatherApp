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

export function getWeatherConditionMorning(code) {

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
export function getWeatherConditionNight(code) {

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