import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { FaSearch, FaMapMarkerAlt, FaRegCalendar } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
// import AutoComplete from './Autocomplete';
import 'react-datepicker/dist/react-datepicker.css';
import styles from '../../styles/Search.module.css';
import SearchContext from './SearchContext';
import

const SearchSection = () => {
  const dummyTags = ['Starting soon', 'Tomorrow', 'Near you', 'Dancers', 'Clowns', 'Magicians'];
  const geoLocation = { lat: 29.954767355989652, lng: -90.06911208674771 };
  const [searchTerm, setSearchTerm] = useState('');
  const [searchLocation, setSearchLocation] = useState(geoLocation);
  const [searchDate, setSearchDate] = useState('');
  const { setResults } = useContext(SearchContext);

  const onSearchSubmit = () => {
    axios.get('https://www.buskr.life/api/events', {
      params: {
        features: 'coords,location,photos,tags',
        lat: searchLocation.lat,
        lng: searchLocation.lng,
        from: searchDate
          || new Date(),
        limit: 5,
      },
    }).then((result) => {
      const byTime = result.data.features.sort(
        (a, b) => a.properties.starts > b.properties.starts,
      );

      let bySearchTerm = byTime;
      if (searchTerm) {
        bySearchTerm = result.data.features.filter(
          (event) => {
            const filteredEvents = event.properties.name.toLowerCase()
              .includes(searchTerm.toLowerCase())
              || event.properties.buskerName.toLowerCase().includes(searchTerm.toLowerCase())
              || event.properties.tags.indexOf(searchTerm.toLowerCase()) !== -1;
            return filteredEvents;
          },
        );
      }
      setResults({ results: byTime, filtered: bySearchTerm });
    });
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setSearchLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
      );
    } else {
      setSearchLocation(geoLocation);
    }
    onSearchSubmit();
  }, []);

  const onSearchTermChange = (e) => {
    setSearchTerm(e.target.value);
  };
  const onSearchLocationChange = (e) => {
    changeToCoords(e.target.value);
  };
  const onDateChange = (date) => {
    if (date !== null) {
      setSearchDate(date);
    }
  };

  const changeToCoords = (location) => {
    // will send to https://www.buskr.life/api/searchLocation to retrieve coordinates
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
  );
};

export default SearchSection;
