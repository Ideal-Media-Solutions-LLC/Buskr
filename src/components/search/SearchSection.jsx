import React, { useCallback, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { FaSearch, FaMapMarkerAlt } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import styles from '../../styles/Search.module.css';
import { searchLink } from '../../interface';

export default function SearchSection({ center, tags }) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [address, setAddress] = useState('');
  const [searchDate, setSearchDate] = useState(new Date());
  const [searchTags, setSearchTags] = useState(() => {
    const searchTags = {};
    for (const tag of tags) {
      searchTags[tag] = false;
    }
    return searchTags;
  });

  const onTagClick = useCallback(ev => {
    const tag = ev.target.innerText;
    setSearchTags(searchTags => {
      const selected = searchTags[tag];
      return { ...searchTags, [tag]: !selected };
    });
  }, [setSearchTags]);

  const tagButtons = useMemo(
    () => Object.entries(searchTags)
      .map(([tag, selected]) => (
        <button
          key={tag}
          type="button"
          className={selected ? `${styles.searchTag} ${styles.selected}` : styles.searchTag}
          onClick={onTagClick}
        >
          {tag}
        </button>
      )),
    [searchTags, onTagClick],
  );

  const selectedTags = useMemo(
    () => Object.entries(searchTags)
      .filter(([, selected]) => selected)
      .map(([tag]) => tag),
    [searchTags],
  );

  const submit = function submit(ev) {
    ev.preventDefault();
    router.push(searchLink({
      center,
      from: searchDate,
      search: searchTerm,
      address,
      sort: 'distance',
      tags: selectedTags,
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
            type="search"
            name="q"
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
        {tagButtons}
      </div>
      <input
        type="hidden"
        name="sort"
        value="distance"
      />
      <input
        type="hidden"
        name="tags"
        value={Object.entries(searchTags).filter(([, sel]) => sel).map(([tag]) => tag).join(',')}
      />
      <button type="submit" id={styles.searchBtn} className="master-button">
        Search
      </button>
    </form>
  );
}
