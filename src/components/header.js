import React from 'react';
import styles from '../styles/header.module.css';

const Header = () => (
  <div className={styles.headerContainer}>
    <div className={styles.hamburgerIconLogoContainer}>
      <img className={styles.hamburger} src='imgs/buskr-hamburger.gif'/>
      <img className={styles.icon}src='imgs/buskr-icon.gif'/>
      <img className={styles.logo}src='imgs/buskr-logo.png'/>
    </div>
    <div className={styles.loginButton}>
      LOGIN / REGISTER
    </div>
  </div>
);
export default Header;
