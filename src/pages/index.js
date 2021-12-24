import React, { useContext, useEffect, useMemo, useState } from 'react';
import SearchSection from '../components/search/SearchSection';
import ResultSection from '../components/search/results/ResultSection';
import { getUser } from '../auth';
import { LocationContext, UserContext } from '../contexts';
import Header from '../components/Header';
import { asyncEffect, findDates, getEvents, getSuggestions } from '../interface';
import TagController from '../db/tag';

/** @param {import('next').GetServerSidePropsContext} context */
export const getServerSideProps = async function getServerSideProps(context) {
  const [user, tags] = await Promise.all([
    getUser(context),
    TagController.getMany(7),
  ]);
  return { props: { user, tags } };
};

export default function Home({ user, tags }) {
  const center = useContext(LocationContext);

  const [dates, setDates] = useState(new Set());
  const [events, setEvents] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  const [from, to] = useMemo(() => {
    const from = new Date();
    const to = new Date(from.getFullYear(), from.getMonth(), from.getDate() + 1);
    return [from, to];
  }, []);

  useEffect(() => center && asyncEffect(
    async () => findDates({ center, offset: from.getTimezoneOffset() }),
    dates => setDates(new Set(dates.map(date => date.getTime()))),
  ), [center, from]);

  useEffect(() => center && asyncEffect(
    async () => getEvents({ center, from, to, limit: 10 }),
    setEvents,
  ), [center, from, to]);

  useEffect(() => center && asyncEffect(
    async () => getSuggestions({ center, from, to }),
    setSuggestions,
  ), [center, from, to]);

  return (
    <UserContext.Provider value={user}>
      <datalist id="suggestions">
        {suggestions.map(suggestion => <option value={suggestion} key={suggestion} />)}
      </datalist>
      <Header />
      <div>
        <SearchSection tags={tags} />
        <ResultSection center={center} dates={dates} events={events} />
      </div>
    </UserContext.Provider>
  );
}
