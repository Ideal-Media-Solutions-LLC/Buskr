import React, { useState } from 'react';
import styles from '../../styles/Search.module.css';
import { Input, DatePicker } from 'antd';
import 'antd/dist/antd.css';
const SearchSection = (props) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchLocation, setSearchLocation] = useState({});
  const [searchDate, setSearchDate] = useState('');
  const onSearchTermChange = (e) => {
    setSearchTerm(e.target.value);
  };
  const dummyTags = ["Starting soon", "Today", "Tomorrow", "Near you", "Dancers", " Clowns", "Magicians", "Artists"];
  const onDateChange = (date, dateString) => {
    if (date !== null) {
      console.log(date._d, dateString);
    }
  };

  return (
    <div id={styles.searchContainer}>
      <h1>Find Your Next Performer:</h1>
      <div id={styles.searchForm}>
        <div className={styles.searchBar}>
          <input className={styles.searchInput} onChange={onSearchTermChange} placeholder="Search by event name" />
          <button className={styles.insideBtn} >🔍</button>
        </div>
        <div className={styles.searchBar}>
          <input className={styles.searchInput} placeholder="Search by location" />
          <button className={styles.insideBtn} >📍</button>
        </div>
        {/* <br/>
        <Input.Search allowClear style={{ width: '95%' }} placeholder="Search by event name" />
        <Input.Search allowClear style={{ width: '95%' }} placeholder="search by location" /> */}


        <DatePicker onChange={onDateChange} style={{ width: '95%' }} />
        <button id={styles.searchBtn} onClick={console.log()}>Search</button>
      </div>
      <div id={styles.tagContainer}>
        {dummyTags.map((tag, index) => {
          return <button className={styles.searchTag} key={index} color="#5C4C4C">{tag}</button>;
        })}
      </div>
    </div>
  );
};



export default SearchSection;