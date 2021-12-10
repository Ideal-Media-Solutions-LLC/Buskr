import React from 'react';
import '../styles/globals.css';
import '../styles/Calendar.css';
import Header from '../components/header.js';

const MyApp = ({ Component, pageProps }) => {
  return (
    <div className='master-container'>
      <Header />
      <Component {...pageProps} />
    </div>
  );
};

export default MyApp;