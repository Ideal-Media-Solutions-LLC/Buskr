import React from 'react';
import EventItem from './EventItem';
import styles from '../../../styles/resultList.module.css';

export default function EventList({ events }) {
  const eventList = events?.length > 0
    ? events.map(event => <EventItem key={event.properties.id} event={event} />)
    : events && <div className={styles.eventListNoEvents}>No Events</div>;
  return (
    <div className="eventListContainer">
      {eventList}
    </div>
  );
}
