import { Router, type Request, type Response } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req: Request, res: Response) => {
    // TODO: GET weather data from city name

  try {
    const { cityName } = req.body;
    console.log(cityName); 
    if (!cityName) {
      return res.status(400).json({ error: 'City name is required' });
    }
      // Retrieve weather data
    const weatherData = await WeatherService.getWeatherForCity(cityName);

     // TODO: save city to search history
    await HistoryService.addCity(cityName);

    return res.json(weatherData);
    

    } catch (error) {
        console.error('Error no weather data:', error);
        return res.status(500).json({ error: 'Failed no weather data' });
    }
});


  // TODO: GET search history
  router.get('/history', async (__req: Request, res: Response) => {
    
      try {
        const searchHistory = await HistoryService.getCities();
        res.json(searchHistory);

      } catch (error) {
          console.error('Error no search history:', error);
          res.status(500).json({ error: 'Failed no search history' });
        }
  });


  // * BONUS TODO: DELETE city from search history
  router.delete('/history/:id', async (req: Request, res: Response) => {

      try {
        const { id } = req.params;
        await HistoryService.removeCity(id);
        res.status(200).json({ message: 'City deleted' });

      } catch (error) {
          console.error('Error deleting city', error);
          res.status(500).json({ error: 'Did not delete city' });
      }
});


export default router;
