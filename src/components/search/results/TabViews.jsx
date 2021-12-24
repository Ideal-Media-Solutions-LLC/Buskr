import React, { useEffect, useState } from 'react';
import styles from '../../../styles/resultList.module.css';

/**
 * @param {Object} props
 * @param {string} props.childStyle
 * @param {React.ReactChildren} props.children
 */
export default function TabViews({ childStyle, children }) {
  const [page, setPage] = useState(0);
  useEffect(() => setPage(0), [children]);
  const tabs = children.map(({ props }, i) => (
    <button
      key={i}
      className={page === i ? styles.activeTabs : styles.tabs}
      onClick={() => setPage(i)}
    >
      {props.icon}
    </button>
  ));
  const pages = children.map((child, i) => (
    <div hidden={page !== i} className={styles.activeContent} key={i}>
      {child}
    </div>
  ));
  return (
    <div className={styles.tabsContainer}>
      <div className={styles.roundedTabs}>
        {tabs}
      </div>
      <div className={childStyle}>
        {pages}
      </div>
    </div>
  );
}
