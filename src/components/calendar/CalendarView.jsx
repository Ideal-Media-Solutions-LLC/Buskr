import { useRouter } from 'next/router';
import Calendar from 'react-calendar';
import React, { useEffect, useState } from 'react';

const CalendarView = () => {
  // const router = useRouter();
  // const { id } = router.query;
  const [date, setDate] = useState(new Date());

  // useEffect(async () => {
  //   const result = await axios.get(`/api/events/${id}`);
  //   setEventData(result.body);
  // }, [id]);

  return (
    <div>
      <h1>Calendar</h1>
      <Calendar
        onChange={setDate}
        value={date}
      />
      <p>
        <span className='bold'>Selected Date:</span>{' '}
        {date.toDateString()}
      </p>
    </div>
  );
};

export default CalendarView;
