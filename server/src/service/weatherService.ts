import fs from 'node:fs/promises';
import dotenv from 'dotenv';
dotenv.config();

interface Coordinates {
  lat: string;
  lon: string;
}

class Weather {
  name: string;
  id: string;

  constructor(name: string, id: string) {
    this.name = name;
    this.id = id;
  }
}

class WeatherService {
  private baseURL: string;
  private apiKey: string;

  constructor() {
    this.baseURL = process.env.API_BASE_URL || 'https://api.openweathermap.org';
    this.apiKey = process.env.API_KEY || 'YOUR_API_KEY';
  }

  // Reads stored weather data
  private async readWeatherData(): Promise<Weather[]> {
    try {
      const data = await fs.readFile('db/db.json', 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading weather data:', error);
      return [];
    }
  }

  // Writes weather data to storage
  private async writeWeatherData(weatherArray: Weather[]): Promise<void> {
    try {
      await fs.writeFile('db/db.json', JSON.stringify(weatherArray, null, 2));
    } catch (error) {
      console.error('Error writing weather data:', error);
    }
  }

  // Fetches coordinates for a city
  private async fetchCoordinates(cityName: string): Promise<Coordinates | null> {
    try {
      const response = await fetch(
        `${this.baseURL}/geo/1.0/direct?q=${cityName}&limit=1&appid=${this.apiKey}`
      );
      const data = await response.json();
      if (data.length > 0) {
        const { lat, lon } = data[0];
        return { lat, lon };
      }
      return null;
    } catch (error) {
      console.error('Error fetching coordinates:', error);
      return null;
    }
  }

  // Fetches weather data for coordinates
  private async fetchWeatherData(coordinates: Coordinates): Promise<Weather | null> {
    try {
      const response = await fetch(
        `${this.baseURL}/data/2.5/weather?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}`
      );
      const data = await response.json();
      if (data) {
        return new Weather(data.name, data.id.toString());
      }
      return null;
    } catch (error) {
      console.error('Error fetching weather data:', error);
      return null;
    }
  }

  // Get weather data by city name
  async getWeatherDataByCity(cityName: string): Promise<Weather | null> {
    const weatherData = await this.readWeatherData();
    const storedCityData = weatherData.find((city) => city.name === cityName);

    if (storedCityData) {
      return storedCityData; // Return stored data if available
    } else {
      const coordinates = await this.fetchCoordinates(cityName);
      if (coordinates) {
        const newCityData = await this.fetchWeatherData(coordinates);
        if (newCityData) {
          await this.addWeatherData(newCityData); // Save new weather data
          return newCityData;
        }
      }
      return null;
    }
  }

  // Adds weather data to storage
  private async addWeatherData(weather: Weather): Promise<void> {
    const weatherData = await this.readWeatherData();
    weatherData.push(weather);
    await this.writeWeatherData(weatherData);
  }

  // Deletes weather data for a city by name
  async deleteWeatherData(cityName: string): Promise<void> {
    const weatherData = await this.readWeatherData();
    const updatedData = weatherData.filter((city) => city.name !== cityName);
    await this.writeWeatherData(updatedData);
  }
}

export default new WeatherService();
