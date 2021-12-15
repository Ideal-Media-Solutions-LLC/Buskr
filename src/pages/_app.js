import React from 'react';
import '../styles/globals.css';
import '../styles/Calendar.css';
import '../styles/Datepicker.css';
import Header from '../components/Header';
import { LocationContext } from '../contexts';

const MyApp = function MyApp({ Component, pageProps }) {
  const [location, setLocation] = React.useState({
    lng: -90.06911208674771,
    lat: 29.954767355989652,
  });
  React.useEffect(() => {
    if (typeof navigator !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(({ coords: { latitude, longitude } }) => {
        setLocation({ lat: latitude, lng: longitude });
      });
    }
  }, []);
  return (
      <LocationContext.Provider value={location}>
        <div className='master-container'>
          <Header />
          <Component {...pageProps} />
        </div>
      </LocationContext.Provider>
  );
};

export default MyApp;
