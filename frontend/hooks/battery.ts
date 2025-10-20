import { useState, useEffect } from 'react';

interface BatteryResponse {
  Battery: number;
}

interface MultiBatteryResponse {
  iPhone: number;
  iPad: number;
}

class BatteryAPI {
  private static readonly BASE_URL = 'https://rest.clt.lol/api';
  private static readonly REFRESH_INTERVAL = 20 * 60 * 1000; // 20 mins

  static async getBatteryLevel(): Promise<BatteryResponse> {
    const res = await fetch(`${this.BASE_URL}/battery/iphone`);
    
    if (!res.ok) {
      throw new Error(`iphone battery api is dead: ${res.status}`);
    }

    return res.json();
  }

  static async getDeviceBattery(device: 'iphone' | 'ipad'): Promise<BatteryResponse> {
    const res = await fetch(`${this.BASE_URL}/battery/${device}`);
    
    if (!res.ok) {
      throw new Error(`${device} battery broke: ${res.status}`);
    }

    return res.json();
  }

  // gets both devices at once cause its faster
  static async getAllBatteries(): Promise<MultiBatteryResponse> {
    const res = await fetch(`${this.BASE_URL}/battery`);
    
    if (!res.ok) {
      throw new Error(`battery api is down: ${res.status}`);
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
      console.warn('battery hook broke:', e);
      setErr(e instanceof Error ? e.message : 'something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBattery();
    
    const timer = setInterval(loadBattery, BatteryAPI['REFRESH_INTERVAL']);
    return () => clearInterval(timer);
  }, []);

  return {
    battery: data,
    loading: isLoading,
    error: err,
  };
};

// hook for both devices - cleaner than doing separate calls
export const multiBattery = () => {
  const [devices, setDevices] = useState<MultiBatteryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBoth = async () => {
    try {
      setLoading(true);
      const data = await BatteryAPI.getAllBatteries();
      setDevices(data);
      setError(null);
    } catch (e) {
      console.warn('both batteries failed:', e);
      setError(e instanceof Error ? e.message : 'api is broken');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBoth();
    
    const interval = setInterval(fetchBoth, BatteryAPI['REFRESH_INTERVAL']);
    return () => clearInterval(interval);
  }, []);

  return {
    batteries: devices,
    loading,
    error,
  };
};
