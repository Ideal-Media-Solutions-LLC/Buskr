import Link from 'next/link';
import React from 'react';
import moment from 'moment-timezone';
import styles from '../../../styles/resultList.module.css';

const EventItem = (props) => {
  const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const time = moment.tz(props.event.properties.starts, zone).format('ddd, MMM D [@] h:mA z');
  const location = `${props.event.properties.location.locality}, ${props.event.properties.location.administrative_area_level_1}`;

  const { name, id, buskerName, buskerId, photos } = props.event.properties;

  return (
    <div className={styles.eventItemContainer}>
      <div className={styles.eventItemContainerNoPadding}>
        <div className={styles.eventItemInfo}>
          <div className={styles.eventItemTime}>
            {time.toUpperCase()}
          </div>
          <div className={styles.eventItemName}>
            <Link href={`/event/${id}`}>
              { name }
            </Link>
          </div>
          <div className={styles.eventItemBusker}>
            <Link href={`/profile/${buskerId}`}>
              {buskerName}
            </Link>
          </div>
          <div className={styles.eventItemLocation}>
            {location}
          </div>
        </div>
        <div className={styles.eventItemOther}>
          <img
            className={styles.eventItemImage}
            src={photos[0]}
            alt="event image"
          />
          <div className={styles.optionalButton}></div>
        </div>
      </div>
    </div>
  );
};

export default EventItem;
