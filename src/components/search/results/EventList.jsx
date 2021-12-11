import React, { useContext } from 'react';
import EventItem from './EventItem';
import SearchContext from '../SearchContext';

const EventList = () => {
  const resultList = useContext(SearchContext);

  return (
    <div className="eventListContainer">
      {resultList.map(
        (event) => (
           <EventItem key={event.properties.id} event={event} />
        ),
      )}
    </div>
  );
};

export default EventList;
