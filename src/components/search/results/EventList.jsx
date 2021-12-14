import React, { useContext } from 'react';
import EventItem from './EventItem';
import SearchContext from '../SearchContext';

const EventList = () => {
<<<<<<< HEAD
  const resultList = useContext(SearchContext).results;
=======
  const resultList = useContext(SearchContext).results.filtered;
>>>>>>> 6bbbba8fefd266132b6eceb2f0ff7b108586693e

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
