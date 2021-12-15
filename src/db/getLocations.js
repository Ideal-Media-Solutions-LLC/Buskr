import axios from 'axios';
import cache from './cache';

const request = axios.create({
  baseURL: 'https://maps.googleapis.com/maps/api/geocode',
  method: 'GET',
});

const reverseGeocode = async function reverseGeocode([lng, lat]) {
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

  return location;
};

const geocache = function geocache(id, [lng, lat]) {
  return cache(`loc:${id}`, async () => reverseGeocode([lng, lat]));
};

export default async function getLocations(rows) {
  return Promise.all(rows.map(async (row) => {
    row.properties.location = await geocache(
      row.properties.id,
      row.geometry.coordinates,
    );
  }));
}
