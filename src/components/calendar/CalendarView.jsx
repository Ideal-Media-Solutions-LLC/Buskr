import Calendar from 'react-calendar';
import React, { useEffect, useState, useContext } from 'react';
import { BsChevronRight, BsChevronLeft } from 'react-icons/bs';
import axios from 'axios';
import { SearchContext } from '../../contexts';

const CalendarView = (props) => {
  // grab the current location data through Conext when no location was entered - default location
  // when the user clicks the Search button, then we would setSearchObj
  // to the passed down filterObject from Search Team
  const SearchbarContext = useContext(SearchContext);
  const [searchObj, setSearchObj] = useState(SearchbarContext.results.filterWords);
  // updates when a date is clicked, will tie this with search function
  const [date, setDate] = useState(searchObj.starts);
  const [calendarStartDate, setCalendarStartDate] = useState(null);
  const filteredDate = searchObj.starts;
  const [currentStartDate, setCurrentStartDate] = useState(
    new Date(filteredDate.getFullYear(), filteredDate.getMonth(), 1),
  );
  const [currentEndDate, setCurrentEndDate] = useState(
    new Date(currentStartDate.getFullYear(), currentStartDate.getMonth() + 1, 0),
  );
  const [eventDates, setEventDates] = useState(new Set());
  // faking dates for research, gets rid of lag using permanent "from" and "to" dates shown below
  const [fakeStartDate, setFakeStartDate] = useState(new Date('2010-01-01'));
  const [fakeEndDate, setFakeEndDate] = useState(new Date('2040-01-01'));

  // updates "from" and "to" dates when month is changed in calendar
  useEffect(() => {
    if (calendarStartDate !== null) {
      findStartEndDates();
    }
  }, [calendarStartDate]);

  // performs search with new "from" and "to" dates
  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_DOMAIN}/api/events?lng=${searchObj.lng}&lat=${searchObj.lat}&from=${fakeStartDate}&to=${fakeEndDate}&sort=time`)
      .then(res => {
        return res.data;
      })
      .then(data => {
        const tempEventDates = new Set();
        data.features.forEach(event => {
          const hasKeywords = searchObj.keywords.toLowerCase().split(' ').every(keyword => {
            if (event.properties.name.toLowerCase().includes(keyword)
              || event.properties.buskerName.toLowerCase().includes(keyword)
              || event.properties.description.toLowerCase().includes(keyword)) {
              return true;
            }
            return false;
          });
          if (hasKeywords) {
            tempEventDates.add(
              (new Date(event.properties.starts.toString().slice(0, 10))).toString().slice(4, 15),
            );
          }
        });
        setEventDates(tempEventDates);
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
  const handleDayClick = (value) => {
    setDate(value);
    SearchbarContext.setCalendarDate(value);
    props.setview(1);
  };

  return (
    <div className='calendar-container'>
      <Calendar
        onClickDay={handleDayClick}
        value={date}
        tileContent={({ date, view }) => view === 'month' && eventDates.has(date.toString().slice(4, 15)) ? <div className="notification"></div> : null}
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
