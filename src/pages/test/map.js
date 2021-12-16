import React from 'react';
import Map from '../../components/map/Map';
import data from '../../../public/sample_events.json';

const containerStyle = {
  height: '80vh',
};

const { coordinates } = data.features[1].geometry;
const [lng, lat] = coordinates;
const center = { lng, lat };

export default function map() {
  return (
  <Map
    containerStyle={containerStyle}
    center={center}
    events={data}
  />
  );
}
