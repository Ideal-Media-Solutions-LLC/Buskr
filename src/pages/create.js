import React from 'react';
import CreateEvent from '../components/create-event/CreateEvent';

const center = {
  lng: -90.06911208674771,
  lat: 29.954767355989652,
};

const CreateEventRenderer = () => {
  return <CreateEvent center={center}/>;
};

export default CreateEventRenderer;
