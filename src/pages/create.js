import React, { useContext } from 'react';
import CreateEvent from '../components/create-event/CreateEvent';
import { getUser } from '../auth';
import { LocationContext, UserContext } from '../contexts';
import Header from '../components/Header';

export const getServerSideProps = async function getServerSideProps(context) {
  const user = await getUser(context);
  return { props: { user } };
};

<<<<<<< HEAD
const CreateEventRenderer = ({ user }) => (
  <UserContext.Provider value={user}>
    <Header />
    <LocationContext.Subscriber>
      {center => <CreateEvent center={center}/>}
    </LocationContext.Subscriber>
  </UserContext.Provider>
);
=======
const CreateEventRenderer = ({ user }) => {
  const center = useContext(LocationContext);
  return (
    <UserContext.Provider value={user}>
      <Header />
      <CreateEvent center={center}/>
    </UserContext.Provider>
  );
};
>>>>>>> 0a11943ae0972765ce271324209f335930a6618e

export default CreateEventRenderer;
