import axios from 'axios';

export default async function findCoords(req, res) {
  const { address } = req.query;
  const { data: { results: [result] } } = await axios.get(
    'https://maps.googleapis.com/maps/api/geocode/json',
    {
      params: {
        address,
        key: process.env.GOOGLE_KEY,
      },
    },
  );
  if (result === undefined) {
    res.send({});
  } else {
    res.send(result.geometry.location);
  }
}
