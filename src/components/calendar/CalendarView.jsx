import Calendar from 'react-calendar';
import React, { useEffect, useState } from 'react';
import { BsChevronRight, BsChevronLeft } from 'react-icons/bs';

const CalendarView = () => {
  // updates when a date is clicked, will tie this with search function
  const [date, setDate] = useState(new Date());
  // fake event data, will replace with API data later
  const eventDates = [1, 2, 4, 10, 20, 25, 31];
  return (
    <div>
      <h1>Calendar</h1>
      <Calendar
        onClickDay={setDate}
        value={date}
<<<<<<< HEAD
        tileContent={({ date, view }) => view === 'month' && eventDates.includes(date.getDate()) ? <div className="notification">*</div> : null}
=======
        prevLabel={<BsChevronLeft />}
        nextLabel={<BsChevronRight />}
        next2Label={null}
        prev2Label={null}
>>>>>>> 37821b74843167f9a73c84d1d2e4f2cb71624f6b
      />
      <div>
        <h3>{date.toDateString()}</h3>
      </div>
    </div>
  );
};

export default CalendarView;
