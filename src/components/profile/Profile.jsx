import React, { useState } from 'react';
import QRCode from 'qrcode.react';
import EventItem from '../search/results/EventItem';
import styles from '../../styles/Profile.module.css';

const paypalLink = 'https://paypal.me/yosefgroener';
const venmoLink = 'https://venmo.com/u/Yosef-groener-1';
const cashappLink = 'https://cash.app/$yosefgroener';

const Profile = ({ performer, user }) => {
  const [qrcodeMode, setQRCodeMode] = useState(false);

  const onIconClick = (link) => {
    console.log('click');
    window.location.href = link;
  };
  // const addEventClick = (e) => {
  //   e.preventDefault();
  //   console.log('click');
  //   // window.location.href = '/create';
  // };

  if (!qrcodeMode) {
    return (
      <div className={styles.profileContainer}>
        <div className='master-title'>{performer?.name}</div>
        <img className={styles.profileImage} src={performer?.photo} alt='profile-image'/>
        <div className={styles.profileBio}>{performer?.bio}</div>
        <div className={styles.tipsContainer}>
          <button className={styles.qrButton} onClick={() => setQRCodeMode(true)}>QR Code</button>
          {/* change these to links that lead to tips URLs */}
          <img className ={styles.tipIcon} src='/imgs/tip-paypal-40px.png' alt='paypal' onClick={() => onIconClick(paypalLink)}/>
          <img className ={styles.tipIcon} src='/imgs/tip-cashapp-40px.png' alt='cashapp' onClick={() => onIconClick(cashappLink)}/>
          <img className ={styles.tipIcon} src='/imgs/tip-venmo-40px.png' alt ='venmo' onClick={() => onIconClick(venmoLink)}/>
        </div>
        {(user !== undefined && performer.id === user.id)
        && <button className='master-button' type='text'>Add Event</button>}
        <div className='master-title'>Upcoming Events:</div>
        <div className={styles.eventCardsContainer}>
          {performer?.events.map((event, i) => <EventItem key={i} event={event}/>)}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.qrContainer}>
      <div className={styles.qrcode}>
        <QRCode value={`https://development.buskr.life/profile${performer.id}`}/>
      </div>
      <button className={styles.backButton} onClick={() => setQRCodeMode(false) }>Back</button>
    </div>
  );
};

export default Profile;
