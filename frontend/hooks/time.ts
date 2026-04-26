import { useEffect, useState } from 'react';

const getTime = (): Date => {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  return new Date(utc + 3600000);
};

export const time = (): Date => {
  const [date, setDate] = useState<Date>(getTime());

  useEffect(() => {
    let ws: WebSocket | null = null;
    let interval: NodeJS.Timeout | null = null;

    const startInterval = () => {
      interval = setInterval(() => setDate(getTime()), 1000);
    };

    try {
      ws = new WebSocket('wss://ws.postman-echo.com/raw');
      ws.onopen = () => ws?.send('time');
      ws.onmessage = () => {};
      ws.onerror = () => ws?.close();
      ws.onclose = startInterval;
    } catch {
      startInterval();
    }
    if (!ws || ws.readyState !== 1) startInterval();

    return () => {
      ws?.close();
      if (interval) clearInterval(interval);
    };
  }, []);

  return date;
};
