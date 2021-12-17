import React, { useContext } from 'react';
import CreateEvent from '../components/create-event/CreateEvent';
import { getUser } from '../auth';
import { LocationContext, UserContext } from '../contexts';
import Header from '../components/Header';

export const getServerSideProps = async function getServerSideProps(context) {
  const user = await getUser(context);
  return { props: { user } };
};

const CreateEventRenderer = ({ user }) => {
  const center = useContext(LocationContext);
  return (
    <UserContext.Provider value={user}>
      <Header />
      <CreateEvent center={center} user={user}/>
    </UserContext.Provider>
  );
};

export default CreateEventRenderer;
