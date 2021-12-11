import React from 'react';
import styles from '../../../styles/resultList.module.css';

const EventItem = (props) => {
  const time = props.event.properties.starts;
  const location = ` ${props.event.properties.location.address}, ${props.event.properties.location.neighborhood} ${props.event.properties.location.administrative_area_level_1}`;

  return (
    <div className="event-item-container">
      <div className="event-item-info">
        <div className="event-item-time">
          {time}
        </div>
        <div>{props.event.properties.name}</div>
        <div>{props.event.properties.buskerName}</div>
        <div>{location}</div>
      </div>
      <div className="eventItemPhoto">
        <img
          className={styles.eventItemImage}
          src={props.event.properties.photos[0]}
          alt="event image"
        />
        <div className="optional-button"></div>
      </div>
    </div>
  );
};

export default EventItem;
