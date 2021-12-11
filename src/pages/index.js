import React from 'react';
import Search from '../components/search/Search';
import CalendarView from '../components/calendar/CalendarView';

export default function Home() {
  return (
    <div>
      Buskr App
      <Search />
      <CalendarView /> 
    </div>
  );
}
