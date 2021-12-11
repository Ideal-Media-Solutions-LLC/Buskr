import React from 'react';
import styles from '../../styles/Profile.module.css';

const Profile = ({ profileData }) => {
  return (
    <div className={styles.profileContainer}>
      <div className='master-title'>{profileData.name}</div>
      <img className={styles.profileImage} src={profileData.photo}/>
      <div className={styles.profileBio}>{profileData.bio}</div>
      <div className={styles.tipsContainer}>
        <img className ={styles.tipIcon} src='/imgs/tip-paypal-40px.png'/>
        <img className ={styles.tipIcon} src='/imgs/tip-cashapp-40px.png'/>
        <img className ={styles.tipIcon} src='/imgs/tip-venmo-40px.png'/>

      </div>
      <button className='master-button' type='text'>Add Event</button>
      <div className='master-title'>Upcoming Events:</div>
      <div className={styles.eventCardsContainer}>
        Event cards go here...
      </div>
    </div>
  );
};

export default Profile;
