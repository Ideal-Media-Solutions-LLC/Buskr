import React from 'react';
import data from '../../../public/singleSampleEvent.json';
import Event from '../../components/Event';

export default function eventPage() {
  return (<Event event={data.features[0]}/>);
}
