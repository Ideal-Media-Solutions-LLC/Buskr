import React, { useEffect, useState } from 'react';
import '../styles/globals.css';
import '../styles/Calendar.css';
import '../styles/Datepicker.css';
import { LocationContext } from '../contexts';

const Buskr = function Buskr({ Component, pageProps }) {
  const [location, setLocation] = useState({});
  useEffect(() => {
    if (typeof navigator !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(({ coords: { latitude, longitude } }) => {
        setLocation({ lat: latitude, lng: longitude });
      });
    }
  }, []);
  return (
      <LocationContext.Provider value={location}>
        <div className='master-container'>
          <Component {...pageProps} />
        </div>
      </LocationContext.Provider>
  );
};

export default Buskr;
