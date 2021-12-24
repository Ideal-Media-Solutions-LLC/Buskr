import React, { useState, useContext } from 'react';
import { useRouter } from 'next/router';
import { FaSearch, FaMapMarkerAlt } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import styles from '../../styles/Search.module.css';
import { LocationContext } from '../../contexts';
import { searchLink } from '../../interface';

export default function SearchSection() {
  const router = useRouter();
  const center = useContext(LocationContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [address, setAddress] = useState('');
  const [searchDate, setSearchDate] = useState(new Date());

  const submit = function submit(ev) {
    ev.preventDefault();
    router.push(searchLink({
      center,
      from: searchDate,
      search: searchTerm,
      address,
      sort: 'distance',
    }));
  };

  return (
    <form id={styles.searchContainer} method="get" action="/search" onSubmit={submit}>
      <label id={styles.title}>
        Find Your Next Performer:
      </label>

      <div id={styles.searchForm}>
        <div className={styles.searchBar} id={styles.upperSearchBar}>
          <input
            type="text"
            name="search"
            className={styles.searchInput}
            value={searchTerm}
            list="suggestions"
            autoComplete="off"
            onBlur={ev => setSearchTerm(ev.target.value)}
            onInput={ev => setSearchTerm(ev.target.value)}
            placeholder="Search events"
          />
          <button className={styles.insideBtn}>
            <FaSearch />
          </button>
        </div>
        <div className={styles.searchBar}>
          <input
            type="text"
            name="address"
            className={styles.searchInput}
            onChange={ev => setAddress(ev.target.value)}
            placeholder="Location"
            value={address}
          />
          <button className={styles.insideBtn}>
            <FaMapMarkerAlt />
          </button>
        </div>
        {/* <label>
          <DatePicker
            customInput={<FaRegCalendar />}/>
          <button id={styles.dateIcon}><FaRegCalendar /></button>
        </label> */}
        <div id={styles.datePicker}>
          <DatePicker
            name="from"
            wrapperClassName={styles.datePicker}
            selected={searchDate}
            onChange={setSearchDate}
            placeholderText="Select Date Here"
          />
        </div>
      </div>
      <div id={styles.tagContainer}>
      </div>
      <input type="hidden" name="sort" value="distance" />
      <button type="submit" id={styles.searchBtn} className="master-button">
        Search
      </button>
    </form>
  );
}
