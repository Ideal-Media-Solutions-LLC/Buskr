import React, { useState, useEffect, useContext } from 'react';
import { FaSearch, FaMapMarkerAlt, FaRegCalendar, FaLongArrowAltLeft } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import AutoComplete from './Autocomplete';
import styles from '../../styles/Search.module.css';
import { LocationContext, SearchContext } from '../../contexts';
import { geolocate, getEvents } from '../../interface';

const nearYouDistance = Number(process.env.NEXT_PUBLIC_CONFLICT_METERS);

const sameDay = (a, b) => a.getDate() === b.getDate()
  && a.getMonth() === b.getMonth()
  && a.getFullYear() === b.getFullYear();

const SearchSection = () => {
  const SearchbarContext = useContext(SearchContext);
  const { results, setResults } = SearchbarContext;
  const geoLocation = useContext(LocationContext);
  const dummyTags = ['Starting soon', 'Tomorrow', 'Near you', 'Dance', 'Magic', 'Clowns'];
  const [searchTerm, setSearchTerm] = useState('');
  const [address, setAddress] = useState('');
  const [searchLocation, setSearchLocation] = useState(geoLocation);
  const [searchDate, setSearchDate] = useState(new Date());
  const [initialList, setInitialList] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  const onSearchSubmit = async () => {
    // SearchbarContext.setBarView(!SearchbarContext.isBarView);
    if (address !== '') {
      await geolocate(address).then(setSearchLocation);
    }
    const searchedPlace = address.toLowerCase();
    const searchedTerm = searchTerm.toLowerCase();
    getEvents({
      features: ['coords', 'location', 'photos', 'tags'],
      lat: searchLocation.lat,
      lng: searchLocation.lng,
      from: searchDate,
    }).then(({ features, properties }) => {
      setInitialList(features);

      const oneDate = features
        .slice()
        .filter(event => sameDay(searchDate, event.properties.starts));

      const byTime = oneDate
        .slice()
        .sort((a, b) => a.properties.starts - b.properties.starts);

      const byLocation = oneDate
        .slice()
        .filter(({ properties: { location } }) => location.address && (
          searchedPlace === location.address.toLowerCase()
          || searchedPlace === location.locality.toLowerCase()
          || searchedPlace === location.administrative_area_level_1.toLowerCase()
        ));

      let bySearchTerm = address === '' ? oneDate : byLocation;
      if (searchTerm) {
        bySearchTerm = bySearchTerm
          .slice()
          .filter(event => event.properties.name.toLowerCase().includes(searchedTerm)
              || event.properties.buskerName.toLowerCase().includes(searchedTerm)
              || event.properties.tags.indexOf(searchedTerm) !== -1);
      }
      const autoSuggestions = new Set();
      bySearchTerm.forEach(
        ({ properties: { name, buskerName, tags } }) => {
          autoSuggestions.add(name);
          autoSuggestions.add(buskerName);
          for (const tag of tags) {
            autoSuggestions.add(tag);
          }
        },
      );
      setSuggestions(Array.from(autoSuggestions));
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
  useEffect(() => {
    setSearchDate(SearchbarContext.calendarDate);
  }, [SearchbarContext.calendarDate]);
  useEffect(() => {
    onSearchSubmit();
  }, [searchDate]);

  const onSearchTermChange = (e) => {
    if (e.target.value) {
      setSearchTerm(e.target.value);
    } else {
      setSearchTerm(e.target.innerText);
    }
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
    SearchbarContext.setBarView(true);
    const tagName = e.target.innerText;
    if (tagName === 'Starting soon') {
      setSearchDate(new Date());
      setResults(
        { ...results, filtered: results.byTime },
      );
    } else if (tagName === 'Tomorrow') {
      const today = new Date();
      const tomorrow = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDay() + 1,
      );

      const tomorrowEvents = initialList
        .slice()
        .filter(event => sameDay(tomorrow, event.properties.starts));

      setSearchDate(tomorrow);
      setResults({ ...results, filtered: tomorrowEvents });
    } else if (tagName === 'Near you') {
      const { byDistance } = results;
      const tooFar = byDistance.findIndex(({ distance }) => distance > nearYouDistance);
      const nearYouEvents = tooFar === -1 ? byDistance.slice() : byDistance.slice(0, tooFar);
      setResults({ ...results, filtered: nearYouEvents });
    } else {
      const bySearchTerm = results.byDistance.slice().filter(
        ({ properties: { name, buskerName, tags } }) => {
          const lowerName = name.toLowerCase();
          const lowerBuskerName = buskerName.toLowerCase();
          const searchedTerm = tagName.toLowerCase();
          const filteredEvents = lowerName.includes(searchedTerm)
            || lowerBuskerName.includes(searchedTerm)
            || tags.indexOf(searchedTerm) !== -1;
          return filteredEvents;
        },
      );
      setResults(
        { ...results, filtered: bySearchTerm },
      );
    }
  };
  const handleSearchBtnClick = () => {
    SearchbarContext.setBarView(true);
    onSearchSubmit();
  };
  const handleBackBtnClick = () => {
    SearchbarContext.setBarView(false);
  };
  if (SearchbarContext.isBarView) {
    return (
      <div id={styles.miniForm}>
        <button id={styles.miniBackBtn}
          onClick={handleBackBtnClick}
        ><FaLongArrowAltLeft />
        </button>
        <div className={styles.miniBar} id={styles.miniTermInput}>
          {/* <AutoComplete
            isBarView={SearchbarContext.isBarView}
            suggestions={suggestions}
            showValue={searchTerm}
            className={styles.miniSearchInput}
            onInputChange={onSearchTermChange}
            placeholder="Search" /> */}
          <input className={styles.miniSearchInput}
            onChange={onSearchTermChange}
            placeholder="Search"
            value = {searchTerm}
          />

          <button className={styles.miniInsideBtn}><FaSearch /></button>
        </div>
        <div className={styles.miniBar} id={styles.miniLocationInput}>
          <input className={styles.miniSearchInput}
            onChange={onSearchLocationChange}
            placeholder="Location"
            value={address}
          />
          <button className={styles.miniInsideBtn}><FaMapMarkerAlt /></button>
        </div>

        {/* <div id={styles.datePicker}>

        <DatePicker wrapperClassName={styles.datePicker} selected={searchDate}
          onChange={onDateChange}
          placeholderText='Select Date Here' /></div> */}
        <button id={styles.miniSearchBtn}
          onClick={onSearchSubmit}
        ><FaSearch />
        </button>

      </div>);
  }
  return (
    <div id={styles.searchContainer}>
      <label id={styles.title}>Find Your Next Performer:</label>

      <div id={styles.searchForm}>
        <div className={styles.searchBar} id={styles.upperSearchBar}>
          <AutoComplete className={styles.searchInput}
            showValue={searchTerm}
            suggestions={suggestions}
            onInputChange={onSearchTermChange}
            placeholder="Search name, performer or type of events" />
          {/* <input className={styles.searchInput}
            onChange={onSearchTermChange}
            placeholder="Search by event name"
          /> */}

          <button className={styles.insideBtn}><FaSearch /></button>
        </div>
        <div className={styles.searchBar}>
          <input className={styles.searchInput}
            onChange={onSearchLocationChange}
            placeholder="Location"
            value={address}
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
      <button id={styles.searchBtn} className="master-button" onClick={handleSearchBtnClick}>Search</button>
    </div>
  );
};

export default SearchSection;
