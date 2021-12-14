import React from 'react';
import '../styles/globals.css';
import '../styles/Calendar.css';
import '../styles/Datepicker.css';
import Header from '../components/Header';

const MyApp = ({ Component, pageProps }) => {
  return (
    <div className='master-container'>
      <Header />
      <Component {...pageProps} />
    </div>
  );
};

export default MyApp;
