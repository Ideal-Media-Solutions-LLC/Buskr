import React, { useState } from 'react';
import styles from '../../styles/CreateEvent.module.css';
import Map from '../map/Map';

// const center = {
//   lng: -90.06911208674771,
//   lat: 29.954767355989652,
// };

const CreateEvent1 = ({ center, setDate }) => {
  const mapContainerStyle = {
    height: '300px',
    width: 'auto',
  };
  return (
    <div className={styles.createEventContainer}>
      <div className='master-title'>Create Event</div>
      <form className={styles.formContainer}>
        <input onChange={setDate} type='search' placeholder='MM/DD/YYYY' className={styles.masterSearchBar}></input>
        <input type='search' placeholder='Enter Start Time' className={styles.masterSearchBar}></input>
        <input type='search' placeholder='Enter End Time' className={styles.masterSearchBar}></input>
        <input type='search' placeholder='Current Location' className={styles.masterSearchBar}></input>
      </form>
      <div className='mapContainer'>
        <Map center={center} containerStyle={mapContainerStyle} withInfoBoxes={false}/>
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

const CreateEvent3 = () => (
  <div className={styles.eventUploadContainer}>
    <div className={styles.formAndButtonContainer}>
      <div className='master-title'>Create Event</div>
      <form className={styles.formContainer}>
        <div className={styles.smallTitle}> Event Name: </div>
        <div className={styles.validationWarning}> Please enter an event name </div>
          <input type='search' className={styles.masterSearchBar} placeholder='Enter Event Name'></input>
        <div className={styles.smallTitle}> Description: </div>
        <div className={styles.validationWarning}> Please enter a description </div>
          <textarea type='search' className={styles.descriptionField}placeholder='Enter Description'></textarea>
        <div className={styles.tagsDescription}>
          <div className={styles.smallTitle}> Tags </div>
          <div className={styles.tagSubtext}> (OPTIONAL - Separated By Comma)  </div>
        </div>
          <input type='search' className={styles.masterSearchBar}placeholder='Add Tags (separated by comma)'></input>
      </form>
      <button type='text' className={styles.uploadImageButton}>Upload Image</button>
    </div>
    <button type='text' className='master-button'> Add My Event </button>
  </div>
);

// const dummyEventInfo = {
//   name: '',
//   description: '',
//   image: '',
//   date: '',
//   start: '',
//   end: '',
//   loc: '',
//   tags: ''
// }

const CreateEvent = ({ center }) => {
  const [eventInfo, setEventInfo] = useState();
  const [name, setEventName] = useState();
  const [description, setEventDescription] = useState();
  const [image, setEventImage] = useState();
  const [date, setEventDate] = useState();
  const [start, setEventStart] = useState();
  const [end, setEventEnd] = useState();
  const [loc, setEventLoc] = useState();
  const [tags, setEventTags] = useState();

  const setDate = (e) => {
    e.preventDefault();
    console.log(e.target.value);
  };

  return (
    <CreateEvent1 center={center} setDate={setDate}/>
    // <CreateEvent2 />
    // <CreateEvent3 />
  );
};

export default CreateEvent;
