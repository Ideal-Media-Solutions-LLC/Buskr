import React, { useEffect, useState } from 'react';
import { getUser } from '../auth';
import { UserContext } from '../contexts';
import Header from '../components/Header';
import AutoComplete from '../components/search/AutoComplete';
import SearchBar from '../components/search/SearchBar';
import EventController from '../db/event';
import { geocode } from '../db/location';
import ResultSection from '../components/search/results/ResultSection';
import { asyncEffect, findDates, getSuggestions } from '../interface';

const dist = Number(process.env.NEXT_PUBLIC_VISIBLE_METERS);

/** @param {import('next').GetServerSidePropsContext} context */
export const getServerSideProps = async function getServerSideProps(context) {
  const user = await getUser(context);

  const { query } = context;
  const { address, q: search, tags: tagString } = query;
  const sort = query.sort === 'time' ? 'starts' : 'distance';

  const center = (address && await geocode(address))
    || { lng: Number(query.lng), lat: Number(query.lat) };

  const from = query.from === undefined ? new Date() : new Date(query.from);
  const to = query.to === undefined
    ? new Date(from.getFullYear(), from.getMonth(), from.getDate() + 1)
    : new Date(query.to);

  try {
    let events = await EventController.getMany({
      center,
      from,
      to,
      limit: query.limit === undefined ? null : Number(query.limit),
      offset: query.offset === undefined ? null : Number(query.offset),
      search,
      dist,
      orderBy: sort,
    });

    if (tagString) {
      const tags = tagString.split(',');
      events = events.filter(event => {
        const eventTags = new Set(event.properties.tags);
        return tags.every(tag => eventTags.has(tag));
      });
    }

    return {
      props: {
        address,
        center,
        from,
        to,
        search,
        events,
        sort,
        user,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      props: {
        address,
        center,
        dates: [],
        from,
        to,
        search,
        events: [],
        sort,
        user,
      },
    };
  }
};

export default function SearchPage({ user, address, center, events, search, sort, from, to }) {
  const [dates, setDates] = useState(new Set());
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => asyncEffect(
    async () => findDates({ center, offset: new Date().getTimezoneOffset(), search }),
    dates => setDates(new Set(dates.map(date => date.getTime()))),
  ), [center, search]);

  useEffect(() => asyncEffect(
    async () => getSuggestions({ center, from, to }),
    setSuggestions,
  ), [center, from, to]);

  return (
    <UserContext.Provider value={user}>
      <AutoComplete suggestions={suggestions} />
      <Header />
      <div>
        <SearchBar
          address={address}
          center={center}
          from={from}
          search={search}
          sort={sort}
        />
        <ResultSection
          center={center}
          dates={dates}
          events={events}
          search={search}
          time={from}
        />
      </div>
    </UserContext.Provider>
  );
}
