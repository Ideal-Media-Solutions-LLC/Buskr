import React, { useState } from 'react';
import Calendar from 'react-calendar';

const CLTest = () => {
  
  const [date, setDate] = useState(new Date());
  
  return (
    <div>
      <h1>CL Calendar</h1>
      <Calendar
        onChange={setDate}
        value={date}
        maxDate={new Date()} // will not allow date later than today
        minDate={new Date(2021, 6, 1)}
      /> 
      <p>
        <span className='bold'>Selected Date:</span>{' '}
        {date.toDateString()}
      </p>
    </div>
  );
};

export default CLTest;