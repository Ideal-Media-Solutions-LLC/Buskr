import axios from 'axios';
import { createClient } from 'redis';

const { CACHE_EXPIRY_SECS: expiry, CACHE_URL: url } = process.env;

const request = axios.create({
  baseURL: 'https://maps.googleapis.com/maps/api/geocode',
  method: 'GET',
});

const cache = createClient({ url });

export const lookup = function lookup() {};

export const reverseLookup = async function reverseLookup(id, [lng, lat]) {
  if (!cache.isOpen) {
    await cache.connect();
  }
  const key = `loc:${id}`;
  const cached = await cache.get(key, 'EX', expiry);
  if (cached) {
    return JSON.parse(cached);
  }

  const { data: { results: [{ address_components }] } } = await
  request(`json?key=${process.env.GEOCODE_API_KEY}&latlng=${lat},${lng}`);

  const condensed = Object.values(address_components)
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
