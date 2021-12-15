import React from 'react';
import CreateEvent from '../components/create-event/CreateEvent';
import { getUser } from '../auth';
import { LocationContext, UserContext } from '../contexts';

export const getServerSideProps = async function getServerSideProps(context) {
  const user = await getUser();
  return { props: { user } };
};

const CreateEventRenderer = () => (
  <LocationContext.Subscriber>
    {center => <CreateEvent center={center}/>}
  </LocationContext.Subscriber>
);

export default CreateEventRenderer;
