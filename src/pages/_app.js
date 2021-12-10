import React from 'react';
import '../styles/globals.css';
import Header from '../components/Header.jsx';

const MyApp = ({ Component, pageProps }) => {
  return (
    <div className='master-container'>
      <Header />
      <Component {...pageProps} />
    </div>
  );
};

export default MyApp;