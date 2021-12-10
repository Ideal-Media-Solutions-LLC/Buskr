import React from 'react';
import SearchSection from './SearchSection.jsx';
import ResultSection from './test/ResultSection.jsx';

const Search = (props) => {
  return (
    <div id='searchContainer'>
      <SearchSection></SearchSection>
      <ResultSection />
    </div>
  );

};
export default Search;