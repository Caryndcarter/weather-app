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
  async getWeatherForCity(cityName: string): 
    const coordinates = await this.fetchLocationData(cityName);
  

  

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
  private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
    const query = `${this.buildWeatherQuery()}&lat=${coordinates.lat}&lon=${coordinates.lon}`;
    const response = await fetch(query);
    return response.json();
  }

  // TODO: Build parseCurrentWeather method
  // private parseCurrentWeather(response: any) {}
  private parseCurrentWeather(data: any): Weather {
    const currentWeather = data;
    const city = data[0];
    const date = 
    const icon = 
    const iconDescription = 
    const tempF =
    const windSpeed = 
    const humidity = 

    return new Weather(city, date, icon, iconDescription, tempF, windSpeed, humidity);
  }
 

  // TODO: Create fetchAndDestructureLocationData method
  // private async fetchAndDestructureLocationData() {}


  // TODO: Complete buildForecastArray method
  // private buildForecastArray(currentWeather: Weather, weatherData: any[]) {}

}

export default new WeatherService();
