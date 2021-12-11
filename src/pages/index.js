import React from 'react';
import Search from '../components/search/Search';
<<<<<<< HEAD
import CalendarView from '../components/calendar/CalendarView';
=======
import Profile from '../components/profile/Profile';
// This is dummy data for Profile team - will be replaced with API
import profileData from '../components/profile/profileData';
>>>>>>> c59efc140e0cd75c02327487dca865f928fad16c

export default function Home() {
  return (
    <div>
<<<<<<< HEAD
      Buskr App
      <Search />
      <CalendarView /> 
=======
      <Search />;
      <Profile profileData={profileData}/>
>>>>>>> c59efc140e0cd75c02327487dca865f928fad16c
    </div>
  );
}
