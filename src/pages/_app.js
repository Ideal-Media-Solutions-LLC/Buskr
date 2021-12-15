import App from 'next/app';
import React from 'react';
import '../styles/globals.css';
import '../styles/Calendar.css';
import '../styles/Datepicker.css';
import Header from '../components/Header';
import UserContext from '../contexts/user';

const MyApp = function MyApp({ Component, pageProps, user }) {
  return (
    <UserContext.Provider value={user}>
      <div className='master-container'>
        <Header />
        <Component {...pageProps} />
      </div>
    </UserContext.Provider>
  );
};

MyApp.getInitialProps = async function getInitialProps(context) {
  const props = await App.getInitialProps(context);
  const { id_token } = context.ctx.req.cookies;
  let user = null;
  if (id_token !== undefined) {
    try {
      // eslint-disable-next-line global-require
      const { verifyIdToken } = await require('../auth');
      const { email, name, sub } = await verifyIdToken(id_token);
      user = { id: sub, email, name };
    } catch (error) {
      console.warn(error);
    }
  }
  return { user, ...props };
};

export default MyApp;
