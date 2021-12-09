import React from 'react';
import styles from '../styles/header.module.css';

const Header = () => (
  <div className={styles.headerContainer}>
    <div className={styles.hamburgerIconLogoContainer}>
      <div className={styles.hamburger}>
        hamburger
      </div>
      <div className={styles.icon}>
        icon
      </div>
      <div className={styles.logo}>
        logo
      </div>
    </div>
    <div className={styles.loginButton}>
      login
    </div>
  </div>
);

export default Header;