import axios from 'axios';

const client = axios.create({
  baseURL: 'https://maps.googleapis.com/maps/api/geocode',
  method: 'GET',
});


export const lookup = function lookup() {};

export const reverseLookup = async function reverseLookup(id, [lng, lat]) {
  const { data: { results: [{ address_components }] } } = await client(`json?key=${process.env.GEOCODE_API_KEY}&latlng=${lat},${lng}`);
  console.log('finished', id);
  const condensed = Object.values(address_components)
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
