import React from 'react';
// import moment from 'moment';
import moment from 'moment-timezone';
import styles from '../../../styles/resultList.module.css';

const EventItem = (props) => {
  const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const time = moment.tz(props.event.properties.starts, zone).format('ddd, MMM D [@] h:mA z');
  const location = `${props.event.properties.location.sublocality}, ${props.event.properties.location.administrative_area_level_1}`;

  return (
    <div className="eventItemContainer">
      <div className="eventItemInfo">
        <div className="eventItemTime">
          {time.toUpperCase()}
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
        <div className="optionalButton"></div>
      </div>
    </div>
  );
};

export default EventItem;
