import React, { useState } from 'react';
import SearchSection from './SearchSection';
import ResultSection from './results/ResultSection';
import SearchContext from './SearchContext';
import data from './results/sampleData';

const Search = (props) => {
  const [results, setResults] = useState(data);

  return (
    <div id='searchContainer'>
      <SearchContext.Provider value={results}>
        <SearchSection></SearchSection>
        <ResultSection />
      </SearchContext.Provider>
    </div>
  );
};
export default Search;
