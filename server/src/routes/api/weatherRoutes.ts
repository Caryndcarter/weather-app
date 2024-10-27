import { Router, type Request, type Response } from 'express';
const router = Router();

//import HistoryService from '../../service/historyService.js';
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
    
    return res.json(weatherData);

    } catch (error) {
        console.error('Error no weather data:', error);
        return res.status(500).json({ error: 'Failed no weather data' });
    }
});


  // TODO: save city to search history


// TODO: GET search history
router.get('/history', async (req: Request, res: Response) => {
  console.log(req); 
  console.log(res); 
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req: Request, res: Response) => {
  console.log(req);
  console.log(res); 
});

export default router;
