import axios from 'axios';
import cache from './cache';

const geocodeAPI = axios.create({
  baseURL: 'https://maps.googleapis.com/maps/api/geocode/json',
  params: {
    key: process.env.GOOGLE_KEY,
  },
});

const reverseGeocodeOne = async function reverseGeocodeOne([lng, lat]) {
  const latlng = `${lat},${lng}`;
  const { data: { results: [address] } } = await geocodeAPI.get('/', { params: { latlng } });

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

  return location;
};

const reverseGeocodeCached = function geocache(id, [lng, lat]) {
  return cache(`loc:${id}`, async () => reverseGeocodeOne([lng, lat]));
};

export const reverseGeocode = async function reverseGeocode(rows) {
  return Promise.all(rows.map(async (row) => {
    row.properties.location = await reverseGeocodeCached(
      row.properties.id,
      row.geometry.coordinates,
    );
  }));
};

export const geocode = async function geocode(address) {
  const { data: { results: [result] } } = await geocodeAPI.get('/', { params: { address } });
  return result === undefined ? null : result.geometry.location;
};
