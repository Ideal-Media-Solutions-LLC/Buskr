import axios from 'axios';

// export default async function findCoords(req, res) {
//   const { address } = req.query;
//   const { GEOCODE_API_KEY } = process.env;
//   const { data: [result] } = await axios.get(
export default async function findCoords(req, res) {
  const { address } = req.query;
  const { GEOCODE_API_KEY } = process.env;
  const resultfromApi = await axios.get(
    'https://maps.googleapis.com/maps/api/geocode/json',
    {
      params: {
        address,
        key: GEOCODE_API_KEY,
      },
    },
  );
  // if (result === undefined) {
  //   res.send({});
  // } else {
  //   res.send(result.geometry.location);
  // }
  res.send(resultfromApi.data.results[0].geometry.location);
}
