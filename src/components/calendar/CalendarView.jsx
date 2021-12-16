import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import SearchContext from '../search/SearchContext';
import Calendar from 'react-calendar';
import { BsChevronRight, BsChevronLeft } from 'react-icons/bs';

const CalendarView = () => {
  const SearchbarContext = useContext(SearchContext);
  const [searchObj, setSearchObj] = useState(SearchbarContext.results.filterWords);
  // updates when a date is clicked, will tie this with search function
  const [date, setDate] = useState(new Date());
  const [calendarStartDate, setCalendarStartDate] = useState(null);
  const filteredDate = searchObj.starts;
  const [currentStartDate, setCurrentStartDate] = useState(
    new Date(filteredDate.getFullYear(), filteredDate.getMonth(), 1),
  );
  const [currentEndDate, setCurrentEndDate] = useState(
    new Date(currentStartDate.getFullYear(), currentStartDate.getMonth() + 1, 0),
  );
  // const [queryData, setQueryData] = useState(null);
  const [eventDates, setEventDates] = useState(new Set());

  // updates "from" and "to" dates when month is changed in calendar
  useEffect(() => {
    if (calendarStartDate !== null) {
      findStartEndDates();
    }
  }, [calendarStartDate]);

  // performs search with new "from" and "to" dates
  useEffect(() => {
    axios.get(`https://www.buskr.life/api/events?lng=${searchObj.lng}&lat=${searchObj.lat}&from=${currentStartDate}&to=${currentEndDate}&sort=distance`)
      .then(res => {
        // do we need a state for queryData?
        // setQueryData(res.data);
        return res.data;
      })
      .then(data => {
        const tempEventDates = new Set();
        data.features.filter(event => event.distance <= 250).forEach(event => {
          const hasKeywords = searchObj.keywords.toLowerCase().split(' ').every(keyword => {
            if (event.properties.name.toLowerCase().includes(keyword)
              || event.properties.buskerName.toLowerCase().includes(keyword)
              || event.properties.description.toLowerCase().includes(keyword)) {
              return true;
            }
            return false;
          });
          if (hasKeywords) {
            tempEventDates.add(parseInt(event.properties.starts.slice(8, 10), 10));
          }
        });
        setEventDates(tempEventDates);
        console.log(tempEventDates);
      });
  }, [currentStartDate, currentEndDate]);

  const findStartEndDates = () => {
    setCurrentStartDate(
      new Date(
        calendarStartDate.activeStartDate.getFullYear(),
        calendarStartDate.activeStartDate.getMonth(),
        1,
      ),
    );
    setCurrentEndDate(
      new Date(
        calendarStartDate.activeStartDate.getFullYear(),
        calendarStartDate.activeStartDate.getMonth() + 1,
        0,
      ),
    );
  };

  return (
    <div className='calendar-container'>
      <Calendar
        onClickDay={setDate}
        value={date}
        tileContent={({ date, view }) => view === 'month' && eventDates.has(date.getDate()) ? <div className="notification"></div> : null}
        prevLabel={<BsChevronLeft />}
        nextLabel={<BsChevronRight />}
        next2Label={null}
        prev2Label={null}
        showNeighboringMonth={false}
        onActiveStartDateChange={setCalendarStartDate}
      />
    </div>
  );
};

export default CalendarView;
