import React from 'react';
import CreateEvent from '../components/create-event/CreateEvent';
import { getUser } from '../auth';
import { LocationContext, UserContext } from '../contexts';
import Header from '../components/Header';

export const getServerSideProps = async function getServerSideProps(context) {
  const user = await getUser(context);
  return { props: { user } };
};

const CreateEventRenderer = ({ user }) => (
  <UserContext.Provider value={user}>
    <Header />
    <LocationContext.Subscriber>
      {center => <CreateEvent center={center}/>}
    </LocationContext.Subscriber>
  </UserContext.Provider>
);

export default CreateEventRenderer;
