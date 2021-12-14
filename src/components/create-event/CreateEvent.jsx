import React, { useState, useEffect } from 'react';
import ImageUploader from './UploadImage';
import styles from '../../styles/CreateEvent.module.css';
import Map from '../map/Map';

// const center = {
//   lng: -90.06911208674771,
//   lat: 29.954767355989652,
// };

const CreateEvent1 = ({
  center, handleDate, handleEndTime, handleStartTime, handleLocation, handleNext,
}) => {
  const mapContainerStyle = {
    height: '300px',
    width: 'auto',
  };

  return (
    <div className={styles.createEventContainer}>
      <div className='master-title'>Create Event</div>
      <form className={styles.formContainer}>
        <input onChange={handleDate} type='search' placeholder='MM/DD/YYYY' className={styles.masterSearchBar}></input>
        <input onChange={handleStartTime} type='search' placeholder='Enter Start Time' className={styles.masterSearchBar}></input>
        <input onChange={handleEndTime} type='search' placeholder='Enter End Time' className={styles.masterSearchBar}></input>
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
  handleName,
  handleDescription,
  handleTags,
  handleImage,
  handleAddMyEvent,
  handleUploadMode,
  uploadMode,
  image,
  submitAttempted,
  name,
  description,
}) => {
  const [uploadView, setUploadView] = useState(false);
  useEffect(() => {
    setUploadView(uploadMode);
  }, [uploadMode]);

  if (!uploadView) {
    return (
      <div className={styles.eventUploadContainer}>
        <div className={styles.formAndButtonContainer}>
          <div className='master-title'>Create Event</div>
          <form className={styles.formContainer}>
            <div className={styles.smallTitle}> Event Name: </div>
            <div className={submitAttempted && !name
              ? styles.validationWarning
              : styles.validationWarningHidden}>
                Please enter an event name
              </div>
              <input onChange={handleName} type='search' className={styles.masterSearchBar} placeholder='Enter Event Name'></input>
            <div className={styles.smallTitle}> Description: </div>
            <div className={submitAttempted && !description
              ? styles.validationWarning
              : styles.validationWarningHidden}> Please enter a description </div>
              <textarea onChange={handleDescription} type='search' className={styles.descriptionField}placeholder='Enter Description'></textarea>
            <div className={styles.tagsDescription}>
              <div className={styles.smallTitle}> Tags </div>
              <div className={styles.tagSubtext}> (OPTIONAL - Separated By Comma)  </div>
            </div>
              <input onChange={handleTags} type='search' className={styles.masterSearchBar}placeholder='Add Tags (separated by comma)'></input>
          </form>
          {/* if image exists, render image, otherwise render button */}
          {image
            ? <img className={styles.uploadedImage} src={image} alt=''/>
            : <button onClick={handleUploadMode} type='text' className={styles.uploadImageButton}>Upload Image</button>
          }

        </div>
        <button onClick={handleAddMyEvent} type='text' className='master-button'> Add My Event </button>
      </div>
    );
  }
  return <ImageUploader handleImage={handleImage}/>;
};

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
  const [createPage, setCreatePage] = useState(3);
  const [name, setEventName] = useState();
  const [description, setEventDescription] = useState();
  const [image, setEventImage] = useState();
  const [date, setEventDate] = useState();
  const [start, setEventStart] = useState();
  const [end, setEventEnd] = useState();
  const [loc, setEventLoc] = useState();
  const [tags, setEventTags] = useState();
  const [uploadMode, setUploadMode] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);

  useEffect(() => {
    setEventLoc(center);
  }, [center]);

  const handleDate = (e) => {
    e.preventDefault();
    setEventDate(e.target.value);
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
    setSubmitAttempted(true);
  };

  const handleImage = (img) => {
    console.log('Upload Image button was clicked!');
    setEventImage(img);
    setUploadMode(false);
  };

  const handleUploadMode = () => {
    console.log('switch upload view!');
    setUploadMode(true);
  };

  if (createPage === 1) {
    return (
      <CreateEvent1
        center={center}
        handleDate={handleDate}
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
        handleUploadMode={handleUploadMode}
        uploadMode={uploadMode}
        image={image}
        submitAttempted={submitAttempted}
        name={name}
        description={description}
      />
    );
  }
  return <div></div>;
};

export default CreateEvent;
