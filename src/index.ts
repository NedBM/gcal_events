import express from 'express';
import axios from 'axios';
import cheerio from 'cheerio';
import cors from 'cors';

const app = express();

// Enable CORS for all routes
app.use(cors());

interface EventType {
    title: string;
    date: string;
    time: string;
    location: string;
}

app.get('/events', async (req, res) => {
    try {
      const url = req.query.url as string;
      const { data } = await axios.get(url);
      const $ = cheerio.load(data);
  
      const events: EventType[] = [];
  
      $('.fusion-events-post').each((i, element) => {
        const title = $(element).find('.fusion-events-title a').text().trim();
        const date = $(element).find('.fusion-date-box').text().trim();
        const time = $(element).find('.fusion-events-time').text().trim();
        const location = $(element).find('.fusion-events-location').text().trim();
  
        const event: EventType = {
          title,
          date,
          time,
          location,
        };
  
        events.push(event);
      });
  
      res.json(events);
    } catch (error) {
      console.error('Error scraping events:', error);
      res.status(500).json({ error: 'Failed to fetch events' });
    }
  });

// Your other routes and Google Calendar API logic here

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});