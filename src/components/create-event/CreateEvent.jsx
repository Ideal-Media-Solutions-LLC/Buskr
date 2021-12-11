import React from 'react';
import styles from '../../styles/CreateEvent.module.css';

const CreateEvent1 = () => {
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
      <button className='master-button' text='Next'>
        Next
      </button>
    </div>
  );
};

const CreateEvent2 = () => (
  <div className={styles.conflictBoxContainer}>
    <div className='master-title'> Create Event </div>
    <div className={styles.conflictBox}>
      <div className>{'Someone is performing at the same location. Do you still wish to have your event on this day and time?'}</div>
      <div className={styles.conflictButtonContainer}>
        <button className={styles.conflictButtonModify}>Modify</button>
        <button className={styles.conflictButtonProceed}>Proceed</button>
      </div>
    </div>

  </div>
);

const CreateEvent = () => {
  return (
    // <CreateEvent1 />
    <CreateEvent2 />
  );
};

export default CreateEvent;
