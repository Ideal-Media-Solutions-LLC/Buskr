import React from 'react';
import styles from '../styles/Header.module.css';

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
      LOGIN / REGISTER
    </div>
  </div>
);
export default Header;
