import React from 'react';
import EventItem from './EventItem';
import styles from '../../../styles/resultList.module.css';

export default function EventList({ events, type }) {
  const eventList = events.length === 0
    ? type && <div className={styles.eventListNoEvents}>No Events</div>
    : events.map(event => <EventItem key={event.properties.id} event={event} />);
  return (
    <div className="eventListContainer">
      {eventList}
    </div>
  );
}
