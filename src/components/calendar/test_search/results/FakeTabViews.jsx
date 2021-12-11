import React, { useState } from 'react';
import { BsListUl, BsMap, BsCalendar3Week } from 'react-icons/bs';
import EventList from '../../../search/results/EventList';
import CalendarView from '../../CalendarView';
import styles from '../../../../styles/resultList.module.css';

const FakeTabViews = () => {
  const [view, setView] = useState(1);
  const changeView = (index) => {
    setView(index);
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
      <div className={styles.tabsContent}>
        <div className={view === 1 ? styles.activeContent : styles.content}>
          {view === 1 ? <EventList /> : <></>}
        </div>
        <div className={view === 2 ? styles.activeContent : styles.content}>
          {view === 2 ? 'Map' : <></>}
        </div>
        <div className={view === 3 ? styles.activeContent : styles.content}>
          {view === 3 ? <CalendarView /> : ''}
        </div>
      </div>
    </div>
  );
};

export default FakeTabViews;
