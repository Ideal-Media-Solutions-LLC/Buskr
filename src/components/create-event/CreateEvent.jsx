import React from 'react';
import styles from '../../styles/CreateEvent.module.css';

const CreateEvent = () => {
  return (
    <div className={styles.createEventContainer}>
      <div className='master-title'>Create Event</div>
      <form className={styles.formContainer}>
        <input type='search' placeholder='Enter Event Date' className={styles.masterSearchBar}></input>
        <input type='search' placeholder='Enter Start Time' className={styles.masterSearchBar}></input>
        <input type='search' placeholder='Enter End Time' className={styles.masterSearchBar}></input>
        <input type='search' placeholder='Current Location' className={styles.masterSearchBar}></input>
      </form>
      <div className={styles.mapContainer}>
        Map goes here
      </div>
      <button className='master-button' text='Next'> Next </button>
    </div>
  );
};

export default CreateEvent;
