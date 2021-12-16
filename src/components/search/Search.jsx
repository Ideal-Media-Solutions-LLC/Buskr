import React, { useState } from 'react';
import SearchSection from './SearchSection';
import ResultSection from './results/ResultSection';
import SearchContext from './SearchContext';

const Search = () => {
  const [results, setResults] = useState({
    byDistance: [],
    byTime: [],
    filtered: [],
    filterWords: {},
  });
  const [isBarView, setBarView] = useState(false);
  const [calendarDate, setCalendarDate] = useState(new Date());
  return (
    <div id='searchContainer'>
      <SearchContext.Provider value={{
        results, setResults, isBarView, setBarView, calendarDate, setCalendarDate,
      }}>
        <SearchSection />
        <ResultSection />
      </SearchContext.Provider>
    </div>
  );
};

export default Search;
