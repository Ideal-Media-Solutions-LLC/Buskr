import Link from 'next/link';
import React from 'react';
import styles from '../styles/Header.module.css';
import UserContext from '../contexts/user';

const auth = process.env.NEXT_PUBLIC_AUTH_DOMAIN;
const client = process.env.NEXT_PUBLIC_AWS_CLIENT;
const domain = process.env.NEXT_PUBLIC_DOMAIN;

const LoginLinks = () => (
  <a href={`${auth}/login?response_type=code&client_id=${client}&redirect_uri=${domain}/login`}>
    LOGIN
    &nbsp;/&nbsp;
    REGISTER
  </a>
);

const UserLinks = ({ user }) => (
  <>
    <Link href={`/profile/${user.id}`}>
      MY PROFILE
    </Link>
    &nbsp;/&nbsp;
    <a href={`${auth}/logout?client_id=${client}&logout_uri=${domain}/logout`}>
      LOGOUT
    </a>
  </>
);

const Header = () => (
  <div className={styles.headerContainer}>
    <div className={styles.hamburgerIconLogoContainer}>
      {/* <img className={styles.logo}src='/imgs/buskr-logo.png'/> */}
      <div className={styles.logoText}>BUSKR</div>
      <img className={styles.icon}src='/imgs/buskr-icon.gif' alt=''/>
      <div className={styles.hamburgerContainer}>
        <div className={styles.hamburgerLine}></div>
        <div className={styles.hamburgerLine}></div>
        <div className={styles.hamburgerLine}></div>
      </div>
    </div>
    <div className={styles.loginButton}>
      <UserContext.Consumer>
        {user => user ? <UserLinks user={user} /> : <LoginLinks />}
      </UserContext.Consumer>
    </div>
  </div>
);
export default Header;
