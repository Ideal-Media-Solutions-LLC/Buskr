import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  FacebookIcon,
  FacebookShareButton,
  TwitterIcon,
  TwitterShareButton,
} from 'react-share';
import { FaClock, FaMapMarkerAlt } from 'react-icons/fa';
import moment from 'moment';
import styles from '../styles/Event.module.css';
import Map from './map/Map';

const Event = function Event({ event }) {
  const url = `${process.env.NEXT_PUBLIC_DOMAIN}/event/${event.id}`;
  const {
    starts,
    ends,
    name,
    tags,
    photos,
    buskerName,
    description,
    location: { address, locality, administrative_area_level_1 },
  } = event.properties;
  const [lng, lat] = event.geometry.coordinates;
  const center = { lng, lat };
  const mapContainerStyle = {
    width: '100%',
    height: '20vh',
  };
  const dateFormat = 'dddd, MMM D, YYYY';
  const timeFormat = 'h:mm a';
  const endTime = moment(ends).format(timeFormat);
  const startTime = moment(starts).format(timeFormat);
  const dateString = moment(starts).format(dateFormat);
  const timeString = `${startTime} - ${endTime}`;
  return (
    <div>
      <img className={styles.eventImage} src={photos[0]} alt={name}/>
      <div className='master-title'>{name}</div>
      <section className={styles.buskerNameContainer}>
      <div className={styles.buskerName}>By {buskerName}</div>
        <FacebookShareButton url={url}>
          <FacebookIcon size={32} round className={styles.socialIcon}/>
        </FacebookShareButton>
        <TwitterShareButton url={url} >
          <TwitterIcon size={32} round className={styles.socialIcon}/>
        </TwitterShareButton>
      </section>
      <section className={styles.timeAndLocContainer}>
        <div className={styles.timeContainer}>
          <FaClock className={styles.timeIcon}/>
          <div className={styles.timeStringContainer}>
            <div>{dateString}</div>
            <div>{timeString}</div>
          </div>
        </div>
        <div className={styles.locContainer}>
          <FaMapMarkerAlt className={styles.locIcon}/>
          <div>{`${address} • ${locality}, ${administrative_area_level_1}`}</div>
        </div>
      </section>
      <section className={styles.mapContainer}>
        <Map
          containerStyle={mapContainerStyle}
          center={center}
          events={{ features: [event] }}
        />
      </section>
      <section>
        <div className='master-title'>Details</div>
        <p>{description}</p>
        <p>{tags}</p>
      </section>
    </div>
  );
};

export default Event;
