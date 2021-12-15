import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { FaSearch, FaMapMarkerAlt, FaRegCalendar } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
// import AutoComplete from './Autocomplete';
import styles from '../../styles/Search.module.css';
import { LocationContext, SearchContext } from '../../contexts';

const SearchSection = () => {
  const SearchbarContext = useContext(SearchContext);
  const { results, setResults } = SearchbarContext;
  const geoLocation = useContext(LocationContext);
  const dummyTags = ['Starting soon', 'Tomorrow', 'Near you', 'Dancers', 'Clowns', 'Magicians'];
  const [searchTerm, setSearchTerm] = useState('');
  const [address, setAddress] = useState('');
  const [searchLocation, setSearchLocation] = useState(geoLocation);
  const [searchDate, setSearchDate] = useState(new Date());
  const [initialList, setInitialList] = useState([]);

  const onSearchSubmit = async () => {
    SearchbarContext.setBarView(!SearchbarContext.isBarView);
    if (address !== '') {
      await axios.get('/api/search', { params: { address } })
        .then((res) => {
          setSearchLocation(res.data);
        });
    }
    axios.get('https://www.buskr.life/api/events', {
      params: {
        features: 'coords,location,photos,tags',
        lat: searchLocation.lat,
        lng: searchLocation.lng,
        from: searchDate,
      },
    }).then((result) => {
      setInitialList(result.data.features);
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
      setResults({
        byDistance: oneDate,
        byTime,
        filtered: bySearchTerm,
        filterWords: {
          lat: searchLocation.lat,
          lng: searchLocation.lng,
          starts: searchDate,
          keywords: searchTerm,
        },
      });
    });
  };

  const onSearchTermChange = (e) => {
    setSearchTerm(e.target.value);
  };
  const onSearchLocationChange = (e) => {
    setAddress(e.target.value);
  };

  const onDateChange = (date) => {
    if (date !== null) {
      setSearchDate(date);
    }
  };

  const onTagClick = (e) => {
    // filter based on initial list when rendered since it will not be visible after initial search
    const tagName = e.target.innerHTML;
    if (tagName === 'Starting soon') {
      setSearchDate(new Date());
      setResults(
        { ...results, filtered: results.byTime },
      );
    } else if (tagName === 'Tomorrow') {
      const today = new Date();
      const tomorrow = new Date();
      tomorrow.setDate(today.getDate() + 1);
      const tomorrowEvents = initialList.slice().filter((event) => {
        const eventDate = new Date(event.properties.starts);
        return tomorrow.getDate() === eventDate.getDate()
          && tomorrow.getMonth() === eventDate.getMonth()
          && tomorrow.getFullYear() === eventDate.getFullYear();
      });
      setSearchDate(tomorrow);
      setResults(
        { ...results, filtered: tomorrowEvents },
      );
    } else if (tagName === 'Near you') {
      const nearYouEvents = results.byDistance.slice().filter((event) => {
        return event.distance <= 250;
      });
      setResults(
        { ...results, filtered: nearYouEvents },
      );
    } else {
      const bySearchTerm = results.byDistance.slice().filter(
        (event) => {
          const tags = ['Dancers', 'Clowns', 'Magicians'];
          for (const tag of tags) {
            if (tagName === tag) {
              const searchedTerm = tag.toLowerCase();
              const filteredEvents = event.properties.name.toLowerCase()
                .includes(searchedTerm)
                || event.properties.buskerName.toLowerCase().includes(searchedTerm)
                || event.properties.tags.indexOf(searchedTerm) !== -1;
              return filteredEvents;
            }
          }
          return [];
        },
      );
      setResults(
        { ...results, filtered: bySearchTerm },
      );
    }
  };
  if (SearchbarContext.isBarView) {
    return (
      <div id={styles.miniForm}>
        <div className={styles.miniBar} id={styles.miniTermInput}>
          {/* <AutoComplete className={styles.searchInput} suggestions={dummyTags} /> */}
          <input className={styles.miniSearchInput}
            onChange={onSearchTermChange}
            placeholder="Search"
          />

          <button className={styles.miniInsideBtn}><FaSearch /></button>
        </div>
        <div className={styles.miniBar} id={styles.miniLocationInput}>
          <input className={styles.miniSearchInput}
            onChange={onSearchLocationChange}
            placeholder="Location"
          />
          <button className={styles.miniInsideBtn}><FaMapMarkerAlt /></button>
        </div>

        {/* <div id={styles.datePicker}>

        <DatePicker wrapperClassName={styles.datePicker} selected={searchDate}
          onChange={onDateChange}
          placeholderText='Select Date Here' /></div> */}
        <button id={styles.miniSearchBtn} className="master-button" onClick={onSearchSubmit}><FaSearch /></button>
      </div>);
  }
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
            placeholderText='Select Date Here' /></div>
      </div>
      <div id={styles.tagContainer}>
        {dummyTags.map((tag, index) => {
          return <button
              className={styles.searchTag}
              key={index} onClick={onTagClick}>
                {tag}
            </button>;
        })}
      </div>
      <button id={styles.searchBtn} className="master-button" onClick={onSearchSubmit}>Search</button>
    </div>
  );
};

export default SearchSection;
