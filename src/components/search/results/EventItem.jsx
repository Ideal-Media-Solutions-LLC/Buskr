import Link from 'next/link';
import React from 'react';
import styles from '../../../styles/resultList.module.css';

const fmtWeekday = new Intl.DateTimeFormat('en-US', { weekday: 'short' });
const fmtDate = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' });
const fmtTime = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric' });

export default function EventItem({ event: { properties } }) {
  const { name, id, buskerId, buskerName, photos, starts } = properties;
  const { locality, administrative_area_level_1 } = properties.location;
  const location = [locality, administrative_area_level_1]
    .filter(string => string)
    .join(', ');
  const profileLink = buskerId ? (
    <Link href={`/profile/${buskerId}`}>
      { buskerName }
    </Link>
  ) : null;

  return (
    <div className={styles.eventItemContainer}>
      <div className={styles.eventItemContainerNoPadding}>
        <div className={styles.eventItemInfo}>
          <div className={styles.eventItemTime}>
            {fmtWeekday.format(starts)}, {fmtDate.format(starts)} @ {fmtTime.format(starts)}
          </div>
          <div className={styles.eventItemName}>
            <Link href={`/event/${id}`}>
              { name }
            </Link>
          </div>
          <div className={styles.eventItemBusker}>
            { profileLink }
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
}
