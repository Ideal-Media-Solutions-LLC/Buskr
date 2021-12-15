import React from 'react';
import moment from 'moment-timezone';
import Link from 'next/link';
import styles from '../../../styles/resultList.module.css';

const EventItem = (props) => {
  const event = props.event.properties;
  const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const time = moment.tz(event.starts, zone).format('ddd, MMM D [@] h:mA z');
  const location = `${event.location.locality}, ${event.location.administrative_area_level_1}`;

  return (
    <div className={styles.eventItemContainer}>
      <div className={styles.eventItemContainerNoPadding}>
        <div className={styles.eventItemInfo}>
          <div className={styles.eventItemTime}>
            {time.toUpperCase()}
          </div>
          <div className={styles.eventItemName}>
          <Link href={`/event/${event.id}`}>
            {event.name}
            </Link>
          </div>
          <div className={styles.eventItemBusker}>
            <Link href={`/profile/${event.buskerId}`}>{event.buskerName}</Link>
          </div>
          <div className={styles.eventItemLocation}>
            {location}
          </div>
        </div>
        <div className={styles.eventItemOther}>
          <img
            className={styles.eventItemImage}
            src={event.photos[0]}
            alt="event image"
          />
          <div className={styles.optionalButton}></div>
        </div>
      </div>
    </div>
  );
};

export default EventItem;
