import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { FaSearch, FaMapMarkerAlt, FaRegCalendar } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import debounce from 'lodash.debounce';
// import AutoComplete from './Autocomplete';
import 'react-datepicker/dist/react-datepicker.css';
import styles from '../../styles/Search.module.css';
import SearchContext from './SearchContext';

const SearchSection = () => {
  const dummyTags = ['Starting soon', 'Tomorrow', 'Near you', 'Dancers', 'Clowns', 'Magicians'];
  const geoLocation = { lat: 29.954767355989652, lng: -90.06911208674771 };
  const [searchTerm, setSearchTerm] = useState('');
  // const [previousSearchTerm, setPreviousSearchTerm] = useState(searchTerm);
  const [searchLocation, setSearchLocation] = useState(geoLocation);
  const [searchDate, setSearchDate] = useState(new Date());
  const { results, setResults } = useContext(SearchContext);

  const onSearchSubmit = async () => {
    console.log(searchLocation.lat);
    axios.get('https://www.buskr.life/api/events', {
      params: {
        features: 'coords,location,photos,tags',
        lat: searchLocation.lat || geoLocation.lat,
        lng: searchLocation.lng || geoLocation.lng,
        from: searchDate,
        limit: 100,
      },
    }).then((result) => {
      const oneDate = result.data.features.slice().filter((event) => {
        const eventDate = new Date(event.properties.starts);
        return searchDate.getDate() === eventDate.getDate()
          && searchDate.getMonth() === eventDate.getMonth()
          && searchDate.getFullYear() === eventDate.getFullYear();
      });
      const byTime = oneDate.slice().sort(
        (a, b) => new Date(a.properties.starts) - new Date(b.properties.starts),
      );
      let bySearchTerm = oneDate;
      if (searchTerm) {
        bySearchTerm = oneDate.filter(
          (event) => {
            const searchedTerm = searchTerm.toLowerCase();
            const filteredEvents = event.properties.name.toLowerCase()
              .includes(searchedTerm)
              || event.properties.buskerName.toLowerCase().includes(searchedTerm)
              || event.properties.tags.indexOf(searchedTerm) !== -1;
            return filteredEvents;
          },
        );
      }
      setResults({ byDistance: oneDate, byTime, filtered: bySearchTerm });
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

  // useEffect(() => {
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(
  //       (position) => setSearchLocation(position.coords.latitude, position.coords.longitude),
  //     );
  //   }
  // }, []);

  const onSearchTermChange = (e) => {
    setSearchTerm(e.target.value);
  };
  const onSearchLocationChange = (e) => {
    if (e.target.value !== '') {
      axios.get('/api/search', { params: { address: e.target.value } })
        .then((res) => {
          setSearchLocation(res.data);
        });
    } else {
      setSearchLocation(geoLocation);
    }
  };

  const onDateChange = (date) => {
    if (date !== null) {
      setSearchDate(date);
    }
  };

  const onTagClick = (e) => {
    console.log(e.target.innerHTML);
    // const tagName = e.target.innerHTML;
    //   if(tagName === 'Starting soon') {
    //     let currentDate = new Date.now();
    //     setSearchDate(currentDate)
    //     onSearchSubmit()
    //     axios.get("/search",)
    //   } else if (tagname === 'Tomorrow') {
    //
    //   } else if (tagname === 'Near you') {
    //
    //   } else {
    //
    //   }
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
              onChange={debounce(onSearchLocationChange, 800)}
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
              placeholderText='Select Date Here' /></div>
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
