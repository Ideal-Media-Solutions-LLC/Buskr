import React, { useState } from 'react';
import { FaSearch, FaMapMarkerAlt, FaRegCalendar } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import AutoComplete from '../../search/Autocomplete';
import 'react-datepicker/dist/react-datepicker.css';
import styles from '../../../styles/Search.module.css';

const FakeSearchSection = () => {
  const dummyTags = ['Starting soon', 'Tomorrow', 'Near you', 'Dancers', 'Clowns', 'Magicians'];
  const [searchTerm, setSearchTerm] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [searchDate, setSearchDate] = useState('');

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
    // axios.get('/search', {params:{
    //   name:searchTerm,
    //   location:searchLocation,
    //   date:searchDate
    // }})
    console.log(searchTerm + searchLocation + searchDate);
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
          <AutoComplete className={styles.searchInput} suggestions={dummyTags} />
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
            placeholderText= 'Select Date Here'></DatePicker></div>
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

export default FakeSearchSection;
