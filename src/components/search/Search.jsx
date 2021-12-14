import React, { useState } from 'react';
import SearchSection from './SearchSection';
import ResultSection from './results/ResultSection';
import SearchContext from './SearchContext';
import data from './results/sampleData';

const Search = () => {
  const [results, setResults] = useState({ byDistance: [], byTime: [], filtered: [] });

  return (
    <div id='searchContainer'>
      <SearchContext.Provider value={{ results, setResults }}>
        <SearchSection></SearchSection>
        <ResultSection />
      </SearchContext.Provider>
    </div>
  );
};
export default Search;
