import Calendar from 'react-calendar';
import React, { useEffect, useState } from 'react';

const CalendarView = () => {
  const [date, setDate] = useState(new Date());
  const eventDates = [1, 2, 4, 10, 20, 25, 31];
  return (
    <div>
      <h1>Calendar</h1>
      <Calendar
        calendarType={"US"}
        onChange={setDate}
        value={date}
        tileContent={({ date, view }) => view === 'month' && eventDates.includes(date.getDate()) ? <div className="notification">*</div> : null}
      />
    </div>
  );
};

export default CalendarView;
