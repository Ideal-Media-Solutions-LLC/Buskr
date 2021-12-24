import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FacebookIcon,
  FacebookShareButton,
  TwitterIcon,
  TwitterShareButton,
} from 'react-share';
import { FaClock, FaMapMarkerAlt } from 'react-icons/fa';
import styles from '../styles/Event.module.css';
import Map from './map/Map';

const fmtWeekday = new Intl.DateTimeFormat('en-US', { weekday: 'long' });
const fmtDate = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
const fmtTime = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric' });

const Event = function Event({ event }) {
  const url = `${process.env.NEXT_PUBLIC_DOMAIN}/event/${event.id}`;
  const {
    starts,
    ends,
    name,
    tags,
    photos,
    buskerId,
    buskerName,
    description,
    location: { address, locality, administrative_area_level_1 },
  } = event.properties;
  const [lng, lat] = event.geometry.coordinates;
  const center = { lng, lat };
  const mapContainerStyle = {
    width: '100%',
    height: '100%',
  };
  const hashTags = tags.map((tag) => `#${tag}`).join(' ');
  return (
    <div className={styles.eventPageContainer}>
      <img className={styles.eventImage} src={photos[0]} alt={name}/>
      <div className='master-title'>{name}</div>
      <section className={styles.buskerNameContainer}>
      <div className={styles.buskerName}>
      <Link href={`/profile/${buskerId}`}>
        { buskerName }
      </Link>
      </div>
        <div>
          <FacebookShareButton url={url}>
            <FacebookIcon className={styles.socialIcon}/>
          </FacebookShareButton>
          <TwitterShareButton url={url} >
            <TwitterIcon className={styles.socialIcon}/>
          </TwitterShareButton>
        </div>
      </section>
      <section className={styles.details}>
        {/* <div className={styles.buskerName}>Details</div> */}
        <div className={styles.hashTags}>
          <div>{hashTags}</div>
        </div>
        <div className={styles.description}>{description}</div>
      </section>
      <section className={styles.timeAndLocContainer}>
        <div className={styles.timeContainer}>
          <FaClock className={styles.icon}/>
          <div className={styles.timeStringContainer}>
            <div>{fmtWeekday.format(starts)}, {fmtDate.format(starts)}</div>
            <div>{fmtTime.format(starts)} - {fmtTime.format(ends)}</div>
          </div>
        </div>
        <div className={styles.locContainer}>
          <FaMapMarkerAlt className={styles.icon}/>
          { address && <div>{`${address} • ${locality}, ${administrative_area_level_1}`}</div> }
        </div>
      </section>
      <section className={styles.mapContainer}>
        <Map
          containerStyle={mapContainerStyle}
          center={center}
          events={[event]}
        />
      </section>
    </div>
  );
};

export default Event;
