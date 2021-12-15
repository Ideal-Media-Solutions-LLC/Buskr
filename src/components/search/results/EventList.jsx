import React, { useContext } from 'react';
import EventItem from './EventItem';
import SearchContext from '../SearchContext';

const EventList = () => {
  const resultList = useContext(SearchContext).results.filtered;
  let eventList;
  if (resultList.length !== 0) {
    eventList = resultList.map((event) => (
      <EventItem key={event.properties.id} event={event} />
    ));
  } else {
    eventList = <div className="eventListNoEvents">No Events</div>;
  }

  return (
    <div className="eventListContainer">
      {eventList}
    </div>
  );
};

export default EventList;
