import React from 'react';
import EventItem from './EventItem';

const EventList = () => {
  return (
    <div className="event-list-Container">
      {/* will refactor when I have a sample data
      {[].map(
        (event) => { */}
      <EventItem />;
      {/* }
      )} */}
    </div>
  );
};

export default EventList;
