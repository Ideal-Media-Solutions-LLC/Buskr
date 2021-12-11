import React from 'react';
import SearchSection from './SearchSection';
// import ResultSection from './results/ResultSection';

const Search = (props) => {
  return (
    <div id='searchContainer'>
      <SearchSection></SearchSection>
      <ResultSection />
    </div>
  );
};
export default Search;
