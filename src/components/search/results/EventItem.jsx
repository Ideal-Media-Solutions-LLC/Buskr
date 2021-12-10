import React from 'react';
import styles from '../../../styles/resultList.module.css';

const EventItem = () => {
  return (
    <div className="event-item-container">
      <div className="event-item-info">
        <div className="event-item-time">
          Day, Date, @ Time Timezone
        </div>
        <div>Title of Event</div>
        <div>Performer Name</div>
        <div>Location</div>
      </div>
      <div className="eventItemPhoto">
        <img
          className={styles.eventItemImage}
          src="https://freerangestock.com/thumbnail/115648/music-notes-.jpg"
          alt="event image"
        />
        <div className="optional-button"></div>
      </div>
    </div>
  );
};

export default EventItem;
