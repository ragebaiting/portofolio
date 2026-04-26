import type { NextApiRequest, NextApiResponse } from 'next';

// In-memory storage (resets on serverless function restart)
let batteryCache = { Battery: 85, lastUpdated: Date.now() };

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).json({ ok: true });
    return;
  }

  if (req.method === 'GET') {
    // Return cached battery data
    res.status(200).json({ Battery: batteryCache.Battery });
    return;
  }

  if (req.method === 'POST') {
    try {
      const { Battery, key } = req.body;

      // Optional: Add simple authentication
      if (key && key !== process.env.BATTERY_API_KEY) {
        res.status(401).json({ error: 'Invalid API key' });
        return;
      }

      // Validate battery data
      if (typeof Battery !== 'number' || Battery < 0 || Battery > 100) {
        res.status(400).json({ error: 'Invalid battery percentage. Must be a number between 0-100' });
        return;
      }

      // Update cached battery data
      batteryCache = {
        Battery: Battery,
        lastUpdated: Date.now()
      };

      console.log(`Battery updated to ${Battery}% at ${new Date().toISOString()}`);

      res.status(200).json({ success: true, Battery: batteryCache.Battery });
    } catch (error) {
      res.status(400).json({ error: 'Invalid JSON data' });
    }
    return;
  }

  res.status(405).json({ error: 'Method not allowed' });
}
