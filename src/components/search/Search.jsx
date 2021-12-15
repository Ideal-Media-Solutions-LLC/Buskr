import React, { useState } from 'react';
import SearchSection from './SearchSection';
import ResultSection from './results/ResultSection';
import { SearchContext } from '../../contexts';

const Search = () => {
  const [results, setResults] = useState({
    byDistance: [],
    byTime: [],
    filtered: [],
    filterWords: {},
  });
  const [isBarView, setBarView] = useState(true);
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
