import React, { useState, useEffect } from 'react';
import FakeSearchSection from './FakeSearchSection';
import FakeResultSection from './results/FakeResultSection';
const dummySearchData = [
  {
    "type":"Feature",
    "geometry": {
      "type":"Point",
      "coordinates":[-90.04911208674771,29.954767355989652]
    },
    "properties": {
      "id":1,
      "ends":"2022-02-03T16:40:34.405+00:00",
      "name":"laboriosam delectus nulla",
      "tags":["acrobatics","magic","poetry"],
      "photos":["http://placeimg.com/640/480/city"],
      "starts":"2022-02-03T16:03:34.405+00:00",
      "buskerId":1,
      "buskerName":"Tom Schaefer",
      "description":"Eius id consequatur recusandae aut dignissimos fuga. Aut vitae dolores. Pariatur velit sapiente quo soluta qui.",
      "location": {
        "neighborhood":"Tremé / Lafitte",
        "locality":"New Orleans",
        "administrative_area_level_2":"Orleans Parish",
        "administrative_area_level_1":"LA",
        "country":"US",
        "postal_code":"70119",
        "postal_code_suffix":"3303",
        "address":"1218 N Broad St"
      }
    }
  },
  //...
];

// Re-fetch data on dateChange:
// 1. onClickDay -> trigger onDateChange()
// 2. onDateChange -> setDate & re-fetch the shared props (props for re-rendering the whole Search component)
// 3. turn off calendar and show List View (props for view change control)
// fetch(currentDate)

const FakeSearchComponent = (props) => {
  /* Extra Stuff for Calendar */
  const [hasDateChanged, setHasDateChanged] = useState(false);
  const [searchData, setSearchData] = useState(null);
  useEffect(() => {
    // this is where we will fetch data from API server!
    // For now, just a dummy data!
    setSearchData(dummySearchData);
  }, [])
  /* Extra Stuff for Calendar */
  if (searchData === null) {
    return (
      <div id='searchContainer'>
        <p>fetching serach data...</p>
      </div>
    );
  } else {
    return (
      <div id='searchContainer'>
        <FakeSearchSection />
        <FakeResultSection />
      </div>
    );
  }
};
export default FakeSearchComponent;