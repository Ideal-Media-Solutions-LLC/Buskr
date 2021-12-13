import axios from 'axios';
import { createClient } from 'redis';

const { CACHE_EXPIRY_SECS: expiry, CACHE_URL: url, CACHE_TLS } = process.env;

const request = axios.create({
  baseURL: 'https://maps.googleapis.com/maps/api/geocode',
  method: 'GET',
});

const cache = createClient({
  socket: { tls: CACHE_TLS === 'true' || CACHE_TLS === '1' },
  url,
});

export const geocode = function geocode() {};

export const reverseGeocode = async function reverseGeocode(id, [lng, lat]) {
  if (!cache.isOpen) {
    await cache.connect();
  }
  const key = `loc:${id}`;
  const cached = await cache.get(key, 'EX', expiry);
  if (cached) {
    return JSON.parse(cached);
  }

  const { data: { results: [address] } } = await
  request(`json?key=${process.env.GOOGLE_KEY}&latlng=${lat},${lng}`);

  if (address === undefined) {
    return {};
  }

  const condensed = Object.values(address.address_components)
    .map(({ short_name, types: [type] }) => [type, short_name]);
  const location = Object.fromEntries(condensed);
  const { street_number, route } = location;
  if (street_number !== undefined && route !== undefined) {
    delete location.street_number;
    delete location.route;
    location.address = `${street_number} ${route}`;
  }

  await cache.setEx(key, expiry, JSON.stringify(location));

  return location;
};

export const getLocations = async function getLocations(rows) {
  return Promise.all(rows.map(async (row) => {
    row.properties.location = await reverseGeocode(row.properties.id, row.geometry.coordinates);
  }));
};
