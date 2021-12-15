import React from 'react';
import EventItem from '../search/results/EventItem';
import styles from '../../styles/Profile.module.css';

const Profile = ({ performer }) => {
  return (
    <div className={styles.profileContainer}>
      <div className='master-title'>{performer?.name}</div>
      <img className={styles.profileImage} src={performer?.photo} alt='profile-image'/>
      <div className={styles.profileBio}>{performer?.bio}</div>
      <div className={styles.tipsContainer}>
        {/* change these to links that lead to tips URLs */}
        <img className ={styles.tipIcon} src='/imgs/tip-paypal-40px.png' alt='paypal'/>
        <img className ={styles.tipIcon} src='/imgs/tip-cashapp-40px.png' alt='cashapp'/>
        <img className ={styles.tipIcon} src='/imgs/tip-venmo-40px.png' alt ='venmo'/>

      </div>
      <button className='master-button' type='text'>Add Event</button>
      <div className='master-title'>Upcoming Events:</div>
      <div className={styles.eventCardsContainer}>
        {performer?.events.map((event, i) => <EventItem key={i} event={event}/>)}
      </div>
    </div>
  );
};

export default Profile;
