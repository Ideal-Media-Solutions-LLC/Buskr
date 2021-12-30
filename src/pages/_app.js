import React, { useEffect, useState } from 'react';
import '../styles/globals.css';
import '../styles/Calendar.css';
import '../styles/Datepicker.css';
import { LocationContext } from '../contexts';
import { locateIP } from '../interface';

export default function Buskr({ Component, pageProps }) {
  const [location, setLocation] = useState(null);
  // It's safe to use asynchronous effects here because the root component is always mounted.
  useEffect(() => {
    const fallbackToIP = () => locateIP().then(setLocation).catch(console.error);
    if (typeof navigator !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        ({ coords: { latitude, longitude } }) => setLocation({ lat: latitude, lng: longitude }),
        fallbackToIP,
      );
    } else {
      fallbackToIP();
    }
  }, [setLocation]);
  return (
      <LocationContext.Provider value={location}>
        <div className='master-container'>
          <Component {...pageProps} />
        </div>
      </LocationContext.Provider>
  );
}
