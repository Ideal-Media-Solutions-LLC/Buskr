import React, { useState } from 'react';
import Search from '../components/search/Search';

export default function Home() {
  const [searchResults, setSearchResults] = useState([]);
  return (
    <div>

        <Search />
        {/* <Profile profileId={1}/> */}
        {/* <CreateEvent/> */}
    </div>
  );
}
