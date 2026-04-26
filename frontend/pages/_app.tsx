import type { AppProps } from 'next/app'


import '../styles/globals.css'
import '../styles/responsive-overrides.css'
import { useEffect } from 'react';

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    const audio = typeof window !== 'undefined' ? new Audio('/audio/pop.mp3') : null;
    const handleClick = () => {
      if (audio) {
        audio.currentTime = 0;
        audio.play();
      }
    };
    window.addEventListener('click', handleClick);
    return () => {
      window.removeEventListener('click', handleClick);
    };
  }, []);
  return <Component {...pageProps} />;
}
