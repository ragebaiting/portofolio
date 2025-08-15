import { useState, useEffect } from 'react';

interface BatteryResponse {
  Battery: number;
}

class BatteryAPI {
  private static readonly BASE_URL = 'https://rest.clt.lol/api';
  private static readonly REFRESH_INTERVAL = 20 * 60 * 1000; // 20 mins

  static async getBatteryLevel(): Promise<BatteryResponse> {
    const res = await fetch(`${this.BASE_URL}/battery`);
    
    if (!res.ok) {
      throw new Error(`fuck, battery api died: ${res.status}`);
    }

    return res.json();
  }
}

export const battery = () => {
  const [data, setData] = useState<BatteryResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const loadBattery = async () => {
    try {
      setIsLoading(true);
      const batteryInfo = await BatteryAPI.getBatteryLevel();
      setData(batteryInfo);
      setErr(null);
    } catch (e) {
      console.warn('battery hook failed:', e);
      setErr(e instanceof Error ? e.message : 'unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBattery();
    
    // refresh every 20 mins
    const timer = setInterval(loadBattery, BatteryAPI['REFRESH_INTERVAL']);
    return () => clearInterval(timer);
  }, []);

  return {
    battery: data,
    loading: isLoading,
    error: err,
  };
};
