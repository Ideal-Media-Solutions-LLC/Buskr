import Calendar from 'react-calendar';
import React, { useEffect, useState } from 'react';
import { BsChevronRight, BsChevronLeft } from 'react-icons/bs';

const CalendarView = () => {
  // updates when a date is clicked, will tie this with search function
  const [date, setDate] = useState(new Date());
  const [initialStartDate, setInitialStartDate] = useState({month: date.getMonth(), year: date.getFullYear()});
  const [currentStartDate, setCurrentStartDate] = useState(null);
  // would make request for dates with events using startDate, which is an object with month and year values
  // example: {month: 11, year: 2021}
  // month range is 0-11
  const [startDate, setStartDate] = useState(initialStartDate);
  // fake event data, will replace with API data later
  const [eventDates, setEventDates] = useState([1, 2, 4, 10, 20, 25, 31]);

  // Rendering the event dots:
  // "2021-12-10T15:26:40.016685-08:00"
  // 1. joined table -> like "2021-12*" - all the events on that month
    // select * 
    // from foo 
    // where timestamp_field::date = '2015-04-15';
    // will grab current month and year from activeStartDate
      // use .getMonth() and .getFullYear() from what is returned, then make request using that information
  // 2. makes all the "days" into an array/set
  // 3. setEventDates to the result array

  // updates currentStartDate whenever month is changed, which we grab month and year from for event date requests
  useEffect(() => {
    if (currentStartDate !== null) {
      setStartDate({month: currentStartDate.activeStartDate.getMonth(), year: currentStartDate.activeStartDate.getFullYear()});
    }
  }, [currentStartDate]);

  return (
    <div>
      <Calendar
        onClickDay={setDate}
        value={date}
        tileContent={({ date, view }) => view === 'month' && eventDates.includes(date.getDate()) ? <div className="notification"></div> : null}
        prevLabel={<BsChevronLeft />}
        nextLabel={<BsChevronRight />}
        next2Label={null}
        prev2Label={null}
        showNeighboringMonth={false}
        onActiveStartDateChange={setCurrentStartDate}
      />
    </div>
  );
};

export default CalendarView;
