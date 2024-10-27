import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: string;
  lon: string;
}

// TODO: Define a class for the Weather object

class Weather {
  city: string;
  date: string;
  icon: string;
  iconDescription: string;
  tempF: number;
  windSpeed: number;
  humidity: number;

  constructor(
    city: string,
    date: string,
    icon: string,
    iconDescription: string,
    tempF: number,
    windSpeed: number,
    humidity: number
  ) {
    this.city = city;
    this.date = date;
    this.icon = icon;
    this.iconDescription = iconDescription;
    this.tempF = tempF;
    this.windSpeed = windSpeed;
    this.humidity = humidity;
  }
}


// TODO: Complete the WeatherService class
class WeatherService {
  private baseURL: string;
  private apiKey: string;

  constructor() {
    this.baseURL = process.env.API_BASE_URL || 'https://api.openweathermap.org';
    this.apiKey = process.env.API_KEY || 'YOUR_API_KEY';
  }
  
  // TODO: Complete getWeatherForCity method
  // async getWeatherForCity(city: string) {}
  async getWeatherForCity(cityName: string) {
    const coordinates = await this.fetchLocationData(cityName);
    const weatherData = await this.fetchWeatherData(coordinates);

    const currentWeather = this.parseCurrentWeather(weatherData);
    const forecastArray = this.buildForecastArray(weatherData);

    return [currentWeather, forecastArray];

  }
  
 // TODO: Create buildGeocodeQuery method
  // private buildGeocodeQuery(): string {}
  private buildGeocodeQuery(): string {
    return `${this.baseURL}/geo/1.0/direct?limit=1&appid=${this.apiKey}`;
  }

  // TODO: Create fetchLocationData method
  private async fetchLocationData(cityName: string): Promise<Coordinates> {
    const query = `${this.buildGeocodeQuery()}&q=${cityName}`;
    const response = await fetch(query);
    const data = await response.json();
    return this.destructureLocationData(data);
  }

  // TODO: Create destructureLocationData method
  private destructureLocationData(data: any): Coordinates {
    const { lat, lon } = data[0];
    return { lat, lon };
  }

 // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(): string {
    return `${this.baseURL}/data/2.5/forecast?appid=${this.apiKey}&units=imperial`;
  }

  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates) {
    const query = `${this.buildWeatherQuery()}&lat=${coordinates.lat}&lon=${coordinates.lon}`;
    const response = await fetch(query);
    return response.json();
  }

  // TODO: Build parseCurrentWeather method
  // private parseCurrentWeather(response: any) {}
  private parseCurrentWeather(response: any): Weather {
    const currentWeather =  response.list[0];
    const city =  response.city.name;
    const date = new Date(currentWeather.dt * 1000).toLocaleDateString();
    const icon = currentWeather.weather[0].icon;
    const iconDescription = currentWeather.weather[0].description;
    const tempF = currentWeather.main.temp;
    const windSpeed = currentWeather.wind.speed;
    const humidity = currentWeather.main.humidity;

    return new Weather(city, date, icon, iconDescription, tempF, windSpeed, humidity);
  }
 
  // TODO: Complete buildForecastArray method
  //private buildForecastArray(data: any): Weather[] {
    //const forecastArray: Weather[] = [];
    //const cityName = data.city.name;

  private buildForecastArray(data: any): Weather[] {
      const forecastArray: Weather[] = [];
      const cityName = data.city.name;
  
      // Filter forecasts to find entries between 11:00 AM and 1:00 PM for the next five days
      const noonForecasts = data.list.filter((forecast: any) => {
        const time = new Date(forecast.dt * 1000).getHours();
        return time >= 11 && time <= 13;  // Matches forecasts close to 12:00 PM
      });
  
      // Select five forecasts, one per day
      let lastDate = '';
      noonForecasts.forEach((forecast: any) => {
          const date = new Date(forecast.dt * 1000).toLocaleDateString();
          
          // Avoid adding multiple forecasts for the same date
          if (date !== lastDate && forecastArray.length < 5) {
              const icon = forecast.weather[0].icon;
              const iconDescription = forecast.weather[0].description;
              const tempF = forecast.main.temp;
              const windSpeed = forecast.wind.speed;
              const humidity = forecast.main.humidity;
  
              forecastArray.push(new Weather(cityName, date, icon, iconDescription, tempF, windSpeed, humidity));
              lastDate = date;  // Update lastDate to prevent duplicate entries for the same day
          }
      });
      console.log("forecast Array from function" + forecastArray[0].city); 
      return forecastArray;
  }


}

export default new WeatherService();
