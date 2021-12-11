import React from 'react';
import SearchSection from '../search/SearchSection';
import FakeResultSection from './results/FakeResultSection';

const FakeSearchComponent = (props) => {
  return (
    <div id='searchContainer'>
      <SearchSection></SearchSection>
      <FakeResultSection />
    </div>
  );
};
export default FakeSearchComponent;