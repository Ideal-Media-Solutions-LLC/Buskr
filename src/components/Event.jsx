import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  FacebookIcon,
  FacebookShareButton,
  TwitterIcon,
  TwitterShareButton,
} from 'react-share';
import styles from '../styles/Event.module.css';

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
  return (
    <div className='master-container'>
      <div className='master-title'>{buskerName}</div>
      <img className={styles.eventImage} src={photos[0]} alt={name}/>
      <div>
        <FacebookShareButton url={url}>
          <FacebookIcon size={32} round/>
        </FacebookShareButton>
        <TwitterShareButton url={url}>
          <TwitterIcon size={32} round/>
        </TwitterShareButton>
      </div>
    </div>
  );
};

export default Event;
