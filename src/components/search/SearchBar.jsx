import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FaSearch, FaMapMarkerAlt, FaLongArrowAltLeft } from 'react-icons/fa';
import { searchLink } from '../../interface';
import styles from '../../styles/Search.module.css';

export default function SearchBar({ address, center, from, search, sort }) {
  const router = useRouter();

  const [formAddress, setFormAddress] = useState(address);
  useEffect(() => setFormAddress(address), [address]);
  const setAddress = (ev) => setFormAddress(ev.target.value);

  const [formSearch, setFormSearch] = useState(search);
  useEffect(() => setFormSearch(search), [search]);
  const setSearch = (ev) => setFormSearch(ev.target.value);

  const submit = function submit(ev) {
    ev.preventDefault();
    router.push(searchLink({ center, from, search: formSearch, address: formAddress, sort }));
  };

  return (
    <form id={styles.miniForm} method="get" action="/search" onSubmit={submit}>
      <Link href="/" passHref={true}>
        <button type="button" id={styles.miniBackBtn}>
          <FaLongArrowAltLeft />
        </button>
      </Link>
      <div className={styles.miniBar} id={styles.miniTermInput}>
        <input
          className={styles.miniSearchInput}
          placeholder="Search"
          name="q"
          autoComplete="off"
          list="suggestions"
          value={formSearch || ''}
          onChange={setSearch}
          onBlur={setSearch}
          onSubmit={submit}
        />
        <button className={styles.miniInsideBtn}>
          <FaSearch />
        </button>
      </div>
      <div className={styles.miniBar} id={styles.miniLocationInput}>
        <input
          className={styles.miniSearchInput}
          placeholder="Location"
          name="address"
          value={formAddress || ''}
          onChange={setAddress}
          onBlur={setAddress}
        />
        <button className={styles.miniInsideBtn}>
          <FaMapMarkerAlt />
        </button>
      </div>
      <input type="hidden" name="lat" value={center.lat} />
      <input type="hidden" name="lng" value={center.lng} />
      <input type="hidden" name="from" value={from.toISOString()} />
      <input type="hidden" name="sort" value={sort} />
      <button type="submit" id={styles.miniSearchBtn}>
        <FaSearch />
      </button>
    </form>
  );
}
