import React from 'react';
import SearchSection from '../search/SearchSection';
import FakeResultSection from './results/FakeResultSection';

// Re-fetch data on dateChange:
// 1. onClickDay -> trigger onDateChange()
// 2. onDateChange -> setDate & re-fetch the shared props (props for re-rendering the whole Search component)
// 3. turn off calendar and show List View (props for view change control)

// fetch(currentDate)

const FakeSearchComponent = (props) => {
  return (
    <div id='searchContainer'>
      <SearchSection></SearchSection>
      <FakeResultSection />
    </div>
  );
};
export default FakeSearchComponent;