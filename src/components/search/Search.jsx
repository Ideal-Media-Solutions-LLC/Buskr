import React, { useContext, useState } from 'react';
import SearchSection from './SearchSection';
import ResultSection from './results/ResultSection';
import { LocationContext, SearchContext } from '../../contexts';

const Search = () => {
  const location = useContext(LocationContext);
  const [results, setResults] = useState({
    byDistance: [],
    byTime: [],
    filtered: [],
    filterWords: {
      lat: location.lat,
      lng: location.lng,
      starts: new Date(),
      keywords: '',
    },
  });
  const [isBarView, setBarView] = useState(false);
  return (
    <div id='searchContainer'>
      <SearchContext.Provider value={{ results, setResults, isBarView, setBarView }}>
        <SearchSection />
        <ResultSection />
      </SearchContext.Provider>
    </div>
  );
};

export default Search;
