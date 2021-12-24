// This file describes the interface between front end and back end.
import axios from 'axios';
import querystring from 'querystring';

const client = axios.create({ baseURL: `${process.env.NEXT_PUBLIC_DOMAIN}/api/` });

const unpackCenter = function unpackCenter(obj) {
  const { lng, lat } = obj.center;
  const toReturn = { ...obj, lng, lat };
  delete toReturn.center;
  return toReturn;
};

export const loadDates = function loadDates({ properties }) {
  properties.starts = new Date(properties.starts);
  properties.ends = new Date(properties.ends);
};

/**
 * @param {Object} data
 * @param {string} data.name
 * @param {string} data.description
 * @param {string[]} data.tags
 * @param {{lng: number, lat: number}} data.center
 * @param {Date} data.starts
 * @param {Date} data.ends
 * @param {string[]} data.photos
 * @returns {Promise<number>} ID of created event
 */
export const createEvent = async function createEvent(data) {
  const { data: { id } } = await client.post('/events', data);
  return id;
};

/**
 * @param {Object} params
 * @param {{lng: number, lat: number}} params.center
 * @param {Date} params.from
 * @param {Date} params.to
 * @param {number=} params.dist
 * @returns {Promise<string[]>} - ids of conflicting events
 */
export const findConflicts = async function findConflicts(params) {
  const { data } = await client.get('/conflicts', { params: unpackCenter(params) });
  return data;
};

/**
 * @param {Object} params
 * @param {{lng: number, lat: number}} params.center
 * @param {number} params.offset
 * @param {number=} params.dist
 * @param {string=} params.search
 * @returns {Promise<Date[]>} - dates with events
 */
export const findDates = async function findDates(params) {
  const { data } = await client.get('/calendar', { params: unpackCenter(params) });
  return data.map(date => new Date(date));
};

/**
 * @param {Object} params
 * @param {{ lng: number, lat: number }} params.center
 * @param {string=} params.search
 * @param {Date=} params.from
 * @param {Date=} params.to
 * @param {number=} params.limit
 * @param {number=} params.offset
 * @param {number=} params.dist
 * @param {'distance' | 'time' | undefined} params.sort
 * @returns {Promise<Event[]>}
 */
export const getEvents = async function getEvents(params) {
  const { data } = await client.get('events', { params: unpackCenter(params) });
  for (const event of data) {
    loadDates(event);
  }
  return data;
};

/**
 * @param {Object} params
 * @param {Date} params.from
 * @param {Date} params.to
 * @param {{ lng: number, lat: number }} params.center
 * @param {number=} params.dist
 * @returns {Promise<string>}
 */
export const getSuggestions = async function getSuggestions(params) {
  const { data } = await client.get('suggestions', { params: unpackCenter(params) });
  return data;
};

/**
 * @param {Object} params
 * @param {{lng: number, lat: number}} params.center,
 * @param {Date} params.from
 * @param {Date?} params.to
 * @param {string?} params.search
 * @param {string?} params.address
 * @param {'distance' | 'time'} params.sort
 */
export const searchLink = function searchLink({ address, center, from, to, search, sort }) {
  const params = {
    lng: center?.lng,
    lat: center?.lat,
    from: from.toISOString(),
    sort,
  };
  if (address) {
    params.address = address;
  }
  if (search) {
    params.q = search;
  }
  if (to) {
    params.to = to.toISOString();
  }
  return `/search?${querystring.stringify(params)}`;
};

/**
 * @template T
 * @param {() => Promise<T>} promise
 * @param {T => void} afterResolve
 */
export const asyncEffect = function asyncEffect(promise, afterResolve) {
  let stillMounted = true;

  promise().then(resolved => {
    if (stillMounted) {
      afterResolve(resolved);
    }
  }).catch(console.error);

  return () => { stillMounted = false; };
};

// Typedefs

/** @typedef {{[field: string]: string}} LocationData */

/**
 * @typedef {Object} Event
 * @property {number?} distance
 * @property {'Feature'} type
 * @property {Object=} geometry
 * @property {'Point'} geometry.type
 * @property {[lng: number, lat: number]} geometry.coordinates
 * @property {Object} properties
 * @property {number} properties.id
 * @property {string} properties.name
 * @property {string} properties.description
 * @property {number} properties.buskerId
 * @property {string} properties.buskerName
 * @property {string[]=} properties.photos
 * @property {string[]=} properties.tags
 * @property {Date} properties.starts
 * @property {Date} properties.ends
 * @property {LocationData=} properties.location
 */

/**
 * @typedef {Object} Profile
 * @property {string} id - UUID
 * @property {string} name
 * @property {string} email
 * @property {boolean} email_verified
 * @property {string?} photo
 * @property {string?} bio
 * @property {string?} paypal
 * @property {string?} cashapp
 * @property {string?} venmo
 * @property {Event[]} events
 */
