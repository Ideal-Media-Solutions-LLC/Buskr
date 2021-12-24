import React from 'react';
import { BsListUl, BsMap, BsCalendar3Week } from 'react-icons/bs';
import Map from '../../map/Map';
import styles from '../../../styles/resultList.module.css';
import EventList from './EventList';
import TabViews from './TabViews';
import CalendarView from '../../calendar/CalendarView';

const mapStyle = {
  height: '100%',
  width: '100%',
};

export default function ResultSection({ center, dates, events, search, time }) {
  return (
    <div className="resultContainer">
    <TabViews childStyle={styles.longtabsContent}>
      <EventList icon={<BsListUl />} events={events} />
      <Map
        icon={<BsMap />}
        className={styles.mapContainer}
        events={events}
        containerStyle={mapStyle}
        center={center}
      />
      <div icon={<BsCalendar3Week />}>
        <CalendarView center={center} dates={dates} search={search} time={time} />
        <img className={styles.buskrArt} src="/imgs/buskr-art.png" alt="" />
      </div>
    </TabViews>
  </div>
  );
}
