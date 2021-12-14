import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
// import TimePicker from 'react-time-picker';
// import 'react-time-picker/dist/TimePicker.css';
// import 'react-clock/dist/Clock.css';
import styles from '../../styles/CreateEvent.module.css';
import Map from '../map/Map';

// const center = {
//   lng: -90.06911208674771,
//   lat: 29.954767355989652,
// };

const CreateEvent1 = ({
  center, handleDate, handleEndTime, handleStartTime, handleLocation, handleNext,
  handleEndDate,
}) => {
  const mapContainerStyle = {
    height: '300px',
    width: 'auto',
  };

  const [startDate, setStartDate] = useState();
  const onDateChange = (date) => {
    if (date !== null) {
      setStartDate(date);
      handleDate(date);
    }
  };

  const [endDate, setEndDate] = useState();
  const onEndDateChange = (date) => {
    if (date !== null) {
      setEndDate(date);
      handleEndDate(date);
    }
  };

  return (
    <div className={styles.createEventContainer}>
      <div className='master-title'>Create Event</div>
      <form className={styles.formContainer}>
        {/* <input onChange={handleDate} type='search' placeholder='MM/DD/YYYY' className={styles.masterSearchBar}></input> */}
        <DatePicker className={styles.datePicker} selected={startDate} onChange={onDateChange} placeholderText='Select Start Date and Time' showTimeSelect/>
        <DatePicker className={styles.datePicker} selected={endDate} onChange={onEndDateChange} placeholderText='Select End Date and Time' showTimeSelect/>
        {/* <input onChange={handleStartTime} type='time' placeholder='Enter Start Time' className={styles.timeInput}></input> */}
        {/* <input onChange={handleEndTime} type='search' placeholder='Enter End Time' className={styles.masterSearchBar}></input> */}
        <input onChange={handleLocation}type='search' placeholder='Current Location' className={styles.masterSearchBar}></input>
      </form>
      <div className='mapContainer'>
        <Map center={center} containerStyle={mapContainerStyle} withInfoBoxes={false}/>
      </div>
      <button onClick={handleNext} className='master-button' text='Next'>
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

const CreateEvent3 = ({
  handleName, handleDescription, handleTags, handleImage, handleAddMyEvent,
}) => (
  <div className={styles.eventUploadContainer}>
    <div className={styles.formAndButtonContainer}>
      <div className='master-title'>Create Event</div>
      <form className={styles.formContainer}>
        <div className={styles.smallTitle}> Event Name: </div>
        <div className={styles.validationWarning}> Please enter an event name </div>
          <input onChange={handleName} type='search' className={styles.masterSearchBar} placeholder='Enter Event Name'></input>
        <div className={styles.smallTitle}> Description: </div>
        <div className={styles.validationWarning}> Please enter a description </div>
          <textarea onChange={handleDescription} type='search' className={styles.descriptionField}placeholder='Enter Description'></textarea>
        <div className={styles.tagsDescription}>
          <div className={styles.smallTitle}> Tags </div>
          <div className={styles.tagSubtext}> (OPTIONAL - Separated By Comma)  </div>
        </div>
          <input onChange={handleTags} type='search' className={styles.masterSearchBar}placeholder='Add Tags (separated by comma)'></input>
      </form>
      <button onClick={handleImage} type='text' className={styles.uploadImageButton}>Upload Image</button>
    </div>
    <button onClick={handleAddMyEvent} type='text' className='master-button'> Add My Event </button>
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
  const [createPage, setCreatePage] = useState(1);
  const [name, setEventName] = useState();
  const [description, setEventDescription] = useState();
  const [image, setEventImage] = useState();
  const [date, setEventDate] = useState(new Date());
  const [start, setEventStart] = useState();
  const [end, setEventEndDate] = useState();
  const [loc, setEventLoc] = useState();
  const [tags, setEventTags] = useState();

  useEffect(() => {
    setEventLoc(center);
  }, [center]);

  const handleDate = (date) => {
    setEventDate(date);
  };

  const handleEndDate = (date) => {
    setEventEndDate(date);
  };

  const handleStartTime = (e) => {
    e.preventDefault();
    setEventStart(e.target.value);
  };

  const handleEndTime = (e) => {
    e.preventDefault();
    setEventEnd(e.target.value);
  };

  const handleLocation = (e) => {
    e.preventDefault();
    setEventLoc(e.target.value);
  };

  const handleName = (e) => {
    e.preventDefault();
    console.log(e.target.value);
    setEventName(e.target.value);
  };

  const handleDescription = (e) => {
    e.preventDefault();
    console.log(e.target.value);
    setEventDescription(e.target.value);
  };

  const handleNext = () => {
    if (date && start && end && loc) {
      setCreatePage(3);
    }
  };

  const handleAddMyEvent = () => {
    console.log('ADD MY EVENT CLICKED!');
  };

  const handleImage = () => {
    console.log('Upload Image button was clicked!');
  };

  if (createPage === 1) {
    return (
      <CreateEvent1
        center={center}
        handleDate={handleDate}
        handleEndDate={handleEndDate}
        handleStartTime={handleStartTime}
        handleEndTime={handleEndTime}
        handleLocation={handleLocation}
        handleNext={handleNext}
      />
    );
  }
  if (createPage === 2) {
    return (
      <CreateEvent2 />
    );
  }
  if (createPage === 3) {
    return (
      <CreateEvent3
        handleName={handleName}
        handleDescription={handleDescription}
        handleImage={handleImage}
        handleAddMyEvent={handleAddMyEvent}
      />
    );
  }
  return <div></div>;
};

export default CreateEvent;
