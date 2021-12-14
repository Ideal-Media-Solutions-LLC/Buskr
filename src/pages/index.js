import React, { useState } from 'react';
import Search from '../components/search/Search';
import SearchContext from '../components/search/SearchContext';
import Profile from '../components/profile/Profile';
// This is dummy data for Profile team - will be replaced with API
// import profileData from '../components/profile/profileData';
import CreateEvent from '../components/create-event/CreateEvent';

export default function Home() {
  const [searchResults, setSearchResults] = useState([]);
  return (
    <div>
      <SearchContext.Provider value={{ searchResults, setSearchResults }}>

        <Search />
        {/* <Profile profileId={1}/> */}
        {/* <CreateEvent/> */}
      </SearchContext.Provider>
    </div>
  );
}
