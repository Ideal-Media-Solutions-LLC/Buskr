import React, { useState } from 'react';
import styles from '../../styles/Search.module.css';
import { Input, DatePicker } from 'antd';
import { FaSearch, FaMapMarkerAlt } from 'react-icons/fa';
import 'antd/dist/antd.css';

const SearchSection = (props) => {
  const dummyTags = ["Starting soon", "Tomorrow", "Near you", "Dancers", "Clowns", "Magicians"];
  const [searchTerm, setSearchTerm] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [searchDate, setSearchDate] = useState('');

  const onSearchTermChange = (e) => {
    setSearchTerm(e.target.value);
  };
  const onSearchLocationChange = (e) => {
    setSearchLocation(e.target.value);
  };
  const onDateChange = (date, dateString) => {
    if (date !== null) {
      console.log(date._d, dateString);
      setSearchDate(dateString);
    }
  };
  const onSearchSubmit = () => {
    // axios.get('/search', {params:{
    //   name:searchTerm,
    //   location:searchLocation,
    //   date:searchDate
    // }})
    alert(searchTerm + searchLocation + searchDate);

  };

  const onTagClick = (e) => {
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
      <h1>Find Your Next Performer:</h1>
      <div id={styles.searchForm}>
        <div className={styles.searchBar}>
          <input className={styles.searchInput}
            onChange={onSearchTermChange}
            placeholder="Search by event name"
          />
          <button className={styles.insideBtn}><FaSearch /></button>
        </div>
        <div className={styles.searchBar}>
          <input className={styles.searchInput}
            onChange={onSearchLocationChange}
            placeholder="Search by location"
          />
          <button className={styles.insideBtn}><FaMapMarkerAlt /></button>
        </div>
        {/* <br/>
        <Input.Search allowClear style={{ width: '95%' }} placeholder="Search by event name" />
        <Input.Search allowClear style={{ width: '95%' }} placeholder="search by location" /> */}

        <div id={styles.datePicker}></div>
        <DatePicker onChange={onDateChange} style={{ width: '95%' }} />
        <button id={styles.searchBtn} onClick={onSearchSubmit}>Search</button>
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