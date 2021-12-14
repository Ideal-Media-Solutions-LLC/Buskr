import React, { useState, useEffect, createContext } from 'react';
import axios from 'axios';
import { FaSearch, FaMapMarkerAlt, FaRegCalendar } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import AutoComplete from './Autocomplete';
import SearchContext from './SearchContext';
import 'react-datepicker/dist/react-datepicker.css';
import styles from '../../styles/Search.module.css';

const SearchSection = () => {
  const dummyTags = ['Starting soon', 'Tomorrow', 'Near you', 'Dancers', 'Clowns', 'Magicians'];
  const geoLocation = { lat: 29.954767355989652, lng: -90.06911208674771 };
  const [searchTerm, setSearchTerm] = useState('');
  const [searchLocation, setSearchLocation] = useState(geoLocation);
  const [searchDate, setSearchDate] = useState('');

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => setSearchLocation(position.coords.latitude, position.coords.longitude),
      );
    }
  }, []);

  const onSearchTermChange = (e) => {
    setSearchTerm(e.target.value);
  };
  const onSearchLocationChange = (e) => {
    setSearchLocation(e.target.value);
  };
  const onDateChange = (date) => {
    if (date !== null) {
      console.log(date);
      setSearchDate(date);
    }
  };
  const onSearchSubmit = () => {
    axios.get('http://www.buskr.life/api/events', {
      params: {
        features: coords,
        lat: geolocation.lat,
        lng: geolocation.lng,
      },
    }).then((data) => {
      console.log(data.features);
    });
    // console.log({
    //   searchTerm: searchTerm,
    //   searchLocation: searchLocation,
    //   searchDate: searchDate
    // });
  };

  const onTagClick = (e) => {
    console.log(e.target.innerHTML);
    //   let tagName = e.target.innerHTML;
    //   if(tagName === 'Starting soon') {
    //     let currentDate = new Date.now();
    //     setSearchDate(currentDate)
    //     onSearchSubmit()
    //     axios.get("/search",)
    //   } else if {}
  };

  return (
    <SearchContext.Provider value={{ setSearchTerm, setSearchLocation }}>
    <div id={styles.searchContainer}>
      <label id={styles.title}>Find Your Next Performer:</label>

      <div id={styles.searchForm}>
        <div className={styles.searchBar} id={styles.upperSearchBar}>
          {/* <AutoComplete className={styles.searchInput} suggestions={dummyTags} /> */}
          <input className={styles.searchInput}
            onChange={onSearchTermChange}
            placeholder="Search by event name"
          />

          <button className={styles.insideBtn}><FaSearch /></button>
        </div>
        <div className={styles.searchBar}>
          <input className={styles.searchInput}
            onChange={onSearchLocationChange}
            placeholder="Location"
          />
          <button className={styles.insideBtn}><FaMapMarkerAlt /></button>
        </div>
        {/* <label>
          <DatePicker
            customInput={<FaRegCalendar />}/>
          <button id={styles.dateIcon}><FaRegCalendar /></button>
        </label> */}
        <div id={styles.datePicker}>

          <DatePicker wrapperClassName={styles.datePicker} selected={searchDate}
            onChange={onDateChange}
            placeholderText='Select Date Here'></DatePicker></div>
        <button id={styles.searchBtn} className="master-button" onClick={onSearchSubmit}>Search</button>
      </div>
      <div id={styles.tagContainer}>
        {dummyTags.map((tag, index) => {
          return <button className={styles.searchTag} key={index} onClick={onTagClick} color="#5C4C4C" >{tag}</button>;
        })}
      </div>
    </div>
    </SearchContext.Provider>
  );
};

export default SearchSection;
