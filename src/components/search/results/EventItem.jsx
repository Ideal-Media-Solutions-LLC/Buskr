import React from 'react';
import moment from 'moment-timezone';
import styles from '../../../styles/resultList.module.css';

const EventItem = (props) => {
  const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const time = moment.tz(props.event.properties.starts, zone).format('ddd, MMM D [@] h:mA z');
  const location = `${props.event.properties.location.sublocality}, ${props.event.properties.location.administrative_area_level_1}`;

  // work on click busker name will lead to profile
  const clickBusker = (e) => {
    console.log(e.target.id);
  };

  return (
    <div className={styles.eventItemContainer}>
      <div className={styles.eventItemContainerNoPadding}>
        <div className={styles.eventItemInfo}>
          <div className={styles.eventItemTime}>
            {time.toUpperCase()}
          </div>
          <div className={styles.eventItemName}>
            {props.event.properties.name}
          </div>
          <div className={styles.eventItemBusker} id="busker" onClick={(e) => clickBusker(e)}>
            {props.event.properties.buskerName}
          </div>
          <div className={styles.eventItemLocation}>
            {location}
          </div>
        </div>
        <div className={styles.eventItemOther}>
          <img
            className={styles.eventItemImage}
            src={props.event.properties.photos[0]}
            alt="event image"
          />
          <div className={styles.optionalButton}></div>
        </div>
      </div>
    </div>
  );
};

export default EventItem;
