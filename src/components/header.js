import React from 'react';
import styles from '../styles/header.module.css';

const Header = () => (
  <div className={styles.headerContainer}>
    <div className={styles.hamburgerIconLogoContainer}>
      <img className={styles.hamburger} src='src/imgs/buskr-hamburger.gif'/>
      <img className={styles.icon} src='src/imgs/buskr-icon.gif'/>

      <img className={styles.logo} src='src/imgs/buskr-logo.png'/>
    </div>
    <div className={styles.loginButton}>
      login
    </div>
  </div>
);
export default Header;