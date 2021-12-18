import React, { useContext, useEffect, useState } from 'react';
import SearchSection from './SearchSection';
import ResultSection from './results/ResultSection';
import { LocationContext, SearchContext } from '../../contexts';

const Search = () => {
  const baseLocation = useContext(LocationContext);
  const [location, setLocation] = useState(baseLocation);
  useEffect(() => setLocation(baseLocation), [baseLocation]);
  const [results, setResults] = useState({
    byDistance: [],
    byTime: [],
    filtered: [],
    filterWords: {
      lat: baseLocation.lat,
      lng: baseLocation.lng,
      starts: new Date(),
      keywords: '',
    },
  });
  const [isBarView, setBarView] = useState(false);
  const [calendarDate, setCalendarDate] = useState(new Date());
  return (
    <div id='searchContainer'>
      <SearchContext.Provider value={{
        results, setResults, isBarView, setBarView, calendarDate, setCalendarDate,
      }}>
        <SearchSection setLocation={setLocation} />
        <ResultSection location={location} />
      </SearchContext.Provider>
    </div>
  );
};

export default Search;
