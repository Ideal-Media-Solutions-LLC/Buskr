import React from 'react';
import Search from '../components/search/Search.jsx';
import Profile from '../components/profile/Profile.jsx';
//This is dummy data for Profile team - will be replaced with API
import profileData from '../components/profile/profileData.js';

export default function Home() {
  return (
    <div>
      {/* <Search /> */}
      <Profile profileData={profileData}/>
    </div>
  );
}
