import { useRouter } from 'next/router';
import Calendar from 'react-calendar';
import React, { useEffect, useState } from 'react';
import { BsChevronRight } from 'react-icons/bs';
import { BsChevronLeft } from 'react-icons/bs';

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
        prevLabel={<BsChevronLeft />}
        nextLabel={<BsChevronRight />}
        next2Label={null}
        prev2Label={null}        
      />
      <p>
        <span className='bold'>Selected Date:</span>{' '}
        {date.toDateString()}
      </p>
    </div>
  );
};

export default CalendarView;
