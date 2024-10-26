import { Router, type Request, type Response } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// POST Request with city name to retrieve weather data
router.post('/', async (req: Request, res: Response) => {
  try {
    const { cityName } = req.body;
    console.log(req.body); 
    console.log(cityName); 
    if (!cityName) {
      return res.status(400).json({ error: 'City name is required' });
    }
    
    // Fetch weather 
    const weatherData = await WeatherService.getWeatherDataByCity(cityName);
    
    if (!weatherData) {
      return res.status(404).json({ error: 'Weather data not found' });
    }

    // Save city to search history
    await HistoryService.addCity(cityName);
    
    return res.json(weatherData);
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return res.status(500).json({ error: 'Failed to retrieve weather data' });
  }
});

// GET Request to retrieve weather data from city name
router.get('/:cityName', async (req: Request, res: Response) => {
  try {
    const { cityName } = req.params;
    
    // Fetch weather data using the new method
    const weatherData = await WeatherService.getWeatherDataByCity(cityName);
    
    if (!weatherData) {
      return res.status(404).json({ error: 'Weather data not found' });
    }
    
    return res.json(weatherData);
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return res.status(500).json({ error: 'Failed to retrieve weather data' });
  }
});

// GET search history
router.get('/history', async (__req: Request, res: Response) => {
  try {
    const searchHistory = await HistoryService.getCities();
    res.json(searchHistory);
  } catch (error) {
    console.error('Error retrieving search history:', error);
    res.status(500).json({ error: 'Failed to retrieve search history' });
  }
});

// BONUS: DELETE city from search history
router.delete('/history/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await HistoryService.removeCity(id);
    res.status(200).json({ message: 'City deleted from search history' });
  } catch (error) {
    console.error('Error deleting city from search history:', error);
    res.status(500).json({ error: 'Failed to delete city from search history' });
  }
});

export default router;
