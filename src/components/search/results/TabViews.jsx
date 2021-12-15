import React, { useState, useContext } from 'react';
import { BsListUl, BsMap, BsCalendar3Week } from 'react-icons/bs';
import EventList from './EventList';
import styles from '../../../styles/resultList.module.css';
import { SearchContext } from '../../../contexts';
import Map from '../../map/Map';
import Calendar from '../../calendar/CalendarView';

const TabViews = () => {
  const SearchbarContext = useContext(SearchContext);
  const [view, setView] = useState(1);
  const changeView = (index) => {
    setView(index);
  };
  const mapStyle = {
    height: '100%',
    width: '100%',
  };

  return (
    <div className={styles.tabsContainer}>
      <div className={styles.roundedTabs}>
        <button
          className={view === 1 ? styles.activeTabs : styles.tabs}
          onClick={() => changeView(1)}>
          <BsListUl />
        </button>
        <button
          className={view === 2 ? styles.activeTabs : styles.tabs}
          onClick={() => changeView(2)}>
          <BsMap />
        </button>
        <button
          className={view === 3 ? styles.activeTabs : styles.tabs}
          onClick={() => changeView(3)}>
          <BsCalendar3Week />
        </button>
      </div>
      <div className={SearchbarContext.isBarView ? styles.longtabsContent : styles.tabsContent}>
        <div className={view === 1 ? styles.activeContent : styles.content}>
          {view === 1 ? <EventList /> : null}
        </div>
        <div className={view === 2 ? styles.activeContent : styles.content}>
          {view === 2 ? 'Map'
            // <Map
            //   events={{ features: SearchbarContext.results.filtered }}
            //   containerStyle={mapStyle}
            //   center={[-90.06911208674771, 29.954767355989652]}
            //   />
            : null}
        </div>
        <div className={view === 3 ? styles.activeContent : styles.content}>
          {view === 3 ? <Calendar /> : null}
        </div>
      </div>
    </div>
  );
};

export default TabViews;
