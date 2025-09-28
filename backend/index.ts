
import { Elysia } from 'elysia';

// for anyone reading this is the discord id used for the data fetching :3
const USER_ID = '1420517549010976792';

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
      console.log('lanyard connected');
      this.ws?.send(JSON.stringify({ op: 2, d: { subscribe_to_id: this.userId } }));
    };
    
    this.ws.onmessage = (event) => this.handleMessage(event);
    
    this.ws.onclose = () => {
      console.log('lanyard disconnected, reconnecting...');
      this.clearHeartbeat();
      setTimeout(() => this.connect(), 2000);
    };
    
    this.ws.onerror = (err) => {
      console.error('ws error:', err);
      this.ws?.close();
    };
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
            console.log('presence updated');
          }
          break;
        case 10: // heartbeat ack?? idk lanyard docs suck
          this.setHeartbeat(() => this.ws?.send(JSON.stringify({ op: 11 })), msg.d.heartbeat_interval);
          break;
        case 11: 
          break;
      }
    } catch (e) {
      console.error('failed to parse lanyard message:', e);
    }
  }
  private setHeartbeat(fn: () => void, interval: number) {
    this.clearHeartbeat();
    this.heartbeat = setInterval(fn, interval);
  }
  
  private clearHeartbeat() {
    if (this.heartbeat) {
      clearInterval(this.heartbeat);
      this.heartbeat = null;
    }
  }
}

// battery stuff - added ipad (1/09/25)
class BatteryManager {
  private data = { 
    iphone: { level: 85, lastUpdate: Date.now() },
    ipad: { level: 72, lastUpdate: Date.now() }
  };
  private apiKey = process.env.BATTERY_API_KEY;

  get() {
    return { 
      iPhone: this.data.iphone.level,
      iPad: this.data.ipad.level 
    };
  }

  getDevice(device: 'iphone' | 'ipad') {
    const deviceData = this.data[device];
    return { 
      Battery: deviceData.level,
      device: device,
      lastUpdate: deviceData.lastUpdate 
    };
  }

  update(level: number, device: 'iphone' | 'ipad', key: string) {
    if (!this.apiKey) {
      throw new Error('no api key set in env');
    }
    
    if (!key || key !== this.apiKey) {
      throw new Error('wrong api key');
    }
    
    if (level < 0 || level > 100) {
      throw new Error('battery % is invalid');
    }

    if (!['iphone', 'ipad'].includes(device)) {
      throw new Error('device must be iphone or ipad');
    }
    
    this.data[device].level = level;
    this.data[device].lastUpdate = Date.now();
    console.log(`${device}: ${level}% at ${new Date().toLocaleTimeString()}`);
    
    return this.get();
  }

  updateLegacy(level: number, key: string) {
    return this.update(level, 'iphone', key);
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
  // lanyard endpoints
  .get('/api/lanyard', () => 
    lanyardPresence ? cors(lanyardPresence) : cors({ error: 'no presence data yet' })
  )
  .options('/api/lanyard', () => cors({ ok: true }))
  
  // battery endpoints
  .get('/api/battery', () => cors(battery.get())) // both devices
  .get('/api/battery/iphone', () => cors(battery.getDevice('iphone')))
  .get('/api/battery/ipad', () => cors(battery.getDevice('ipad')))
  
  // update specific device battery
  .post('/api/battery/:device', async ({ params, body }) => {
    try {
      const { device } = params;
      const { Battery: level, key } = body as any;
      
      if (!['iphone', 'ipad'].includes(device)) {
        return cors({ error: 'device must be iphone or ipad' });
      }
      
      const result = battery.update(level, device as 'iphone' | 'ipad', key);
      return cors({ success: true, ...result });
    } catch (err: any) {
      return cors({ error: err.message });
    }
  })
  
  // legacy endpoint (defaults to iphone)
  .post('/api/battery', async ({ body }) => {
    try {
      const { Battery: level, key } = body as any;
      const result = battery.updateLegacy(level, key);
      return cors({ success: true, ...result });
    } catch (err: any) {
      return cors({ error: err.message });
    }
  })
  
  .options('/api/battery', () => cors({ ok: true }))
  .options('/api/battery/:device', () => cors({ ok: true }))
  .listen(3001);

console.log('server started on port 3001');

