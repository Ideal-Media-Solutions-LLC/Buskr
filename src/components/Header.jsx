import Link from 'next/link';
import React, { useContext } from 'react';
import styles from '../styles/Header.module.css';
import { UserContext } from '../contexts';

const auth = process.env.NEXT_PUBLIC_AUTH_DOMAIN;
const client = process.env.NEXT_PUBLIC_AWS_CLIENT;
const domain = process.env.NEXT_PUBLIC_DOMAIN;

const LoginLinks = function LoginLinks() {
  return (
    <a href={`${auth}/login?response_type=code&client_id=${client}&redirect_uri=${domain}/login`}>
      LOGIN
      &nbsp;/&nbsp;
      REGISTER
    </a>
  );
};

const UserLinks = function UserLinks({ userID }) {
  return (
    <>
      <Link href={`/profile/${userID}`}>
        MY PROFILE
      </Link>
      &nbsp;/&nbsp;
      <a href={`${auth}/logout?client_id=${client}&logout_uri=${domain}/logout`}>
        LOGOUT
      </a>
    </>
  );
};

export default function Header() {
  const user = useContext(UserContext);
  return (
    <div className={styles.headerContainer}>
      <div className={styles.hamburgerIconLogoContainer}>
        <div className={styles.logoText}>
          <Link href='/'>BUSKR</Link>
        </div>
        <img className={styles.icon} src='/imgs/buskr-icon-clean.png' alt='' />
        <div className={styles.hamburgerContainer}>
          <div className={styles.hamburgerLine} />
          <div className={styles.hamburgerLine} />
          <div className={styles.hamburgerLine} />
        </div>
      </div>
      <div className={styles.loginButton}>
        {user ? <UserLinks userID={user.id} /> : <LoginLinks />}
      </div>
    </div>
  );
}
