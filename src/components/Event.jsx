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
  const hashTags = tags.map((tag) => `#${tag}`).join(' ');
  return (
    <div className={styles.eventPageContainer}>
      <img className={styles.eventImage} src={photos[0]} alt={name}/>
      <div className='master-title'>{name}</div>
      <section className={styles.buskerNameContainer}>
      <div className={styles.buskerName}>By {buskerName}</div>
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
        <div>{description}</div>
      </section>
      <section className={styles.timeAndLocContainer}>
        <div className={styles.timeContainer}>
          <FaClock className={styles.icon}/>
          <div className={styles.timeStringContainer}>
            <div>{dateString}</div>
            <div>{timeString}</div>
          </div>
        </div>
        <div className={styles.locContainer}>
          <FaMapMarkerAlt className={styles.icon}/>
          <div>{`${address} • ${locality}, ${administrative_area_level_1}`}</div>
        </div>
      </section>

      <div className={styles.mapContainerContainer}>
        <section className={styles.mapContainer}>
          <Map
            containerStyle={mapContainerStyle}
            center={center}
            events={{ features: [event] }}
          />
        </section>
      </div>
    </div>
  );
};

export default Event;
