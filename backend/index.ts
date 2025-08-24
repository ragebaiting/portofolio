
import { Elysia } from 'elysia';

// for anyone reading this is the discord id used for the data fetching :3
const USER_ID = '1389302831600631899';

let lanyardPresence: any = null;

class LanyardWS {
  private ws: WebSocket | null = null;
  private heartbeat: NodeJS.Timeout | null = null;
  constructor(private userId: string) {
    this.connect();
  }
  private connect() {
    this.ws = new WebSocket('wss://api.lanyard.rest/socket');
    this.ws.onopen = () => {
      this.ws?.send(JSON.stringify({ op: 2, d: { subscribe_to_id: this.userId } }));
    };
    this.ws.onmessage = (event) => this.handleMessage(event);
    this.ws.onclose = () => {
      this.clearHeartbeat();
      setTimeout(() => this.connect(), 2000);
    };
    this.ws.onerror = () => this.ws?.close();
  }
  private handleMessage(event: MessageEvent) {
    try {
      const msg = JSON.parse(event.data);
      switch (msg.op) {
        case 1:
          this.setHeartbeat(() => this.ws?.send(JSON.stringify({ op: 3 })), msg.d.heartbeat_interval);
          break;
        case 0:
          if (msg.t === 'INIT_STATE' || msg.t === 'PRESENCE_UPDATE') {
            lanyardPresence = msg.d;
          }
          break;
        case 10:
          this.setHeartbeat(() => this.ws?.send(JSON.stringify({ op: 11 })), msg.d.heartbeat_interval);
          break;
        case 11:
          break;
      }
    } catch (e) {
      console.error('Lanyard WS error:', e);
    }
  }
  private setHeartbeat(fn: () => void, interval: number) {
    this.clearHeartbeat();
    this.heartbeat = setInterval(fn, interval);
  }
  private clearHeartbeat() {
    if (this.heartbeat) clearInterval(this.heartbeat);
    this.heartbeat = null;
  }
}

// battery stuff - just a simple cache
class BatteryManager {
  private data = { level: 85, lastUpdate: Date.now() };
  private apiKey = process.env.BATTERY_API_KEY;

  get() {
    return { Battery: this.data.level };
  }

  update(level: number, key: string) {
    if (!this.apiKey) {
      throw new Error('api key not configured');
    }
    
    if (!key || key !== this.apiKey) {
      throw new Error('nope, wrong key');
    }
    
    if (level < 0 || level > 100) {
      throw new Error('battery level makes no sense');
    }
    
    this.data.level = level;
    this.data.lastUpdate = Date.now();
    console.log(`battery: ${level}% (${new Date().toLocaleTimeString()})`);
    
    return this.get();
  }
}

new LanyardWS(USER_ID);
const battery = new BatteryManager();

// simple cors helper
const cors = (data: any) => new Response(JSON.stringify(data), {
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  },
});

const app = new Elysia()
  .get('/api/lanyard', () => 
    lanyardPresence ? cors(lanyardPresence) : cors({ error: 'No presence data yet' })
  )
  .options('/api/lanyard', () => cors({ ok: true }))
  
  .get('/api/battery', () => cors(battery.get()))
  
  .post('/api/battery', async ({ body }) => {
    try {
      const { Battery: level, key } = body as any;
      const result = battery.update(level, key);
      return cors({ success: true, ...result });
    } catch (err: any) {
      return cors({ error: err.message });
    }
  })
  
  .options('/api/battery', () => cors({ ok: true }))
  .listen(3001);

console.log('server running on :3001');

