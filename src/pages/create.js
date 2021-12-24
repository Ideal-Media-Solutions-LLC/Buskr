import React, { useContext } from 'react';
import CreateEvent from '../components/create-event/CreateEvent';
import { getUser } from '../auth';
import { LocationContext, UserContext } from '../contexts';
import Header from '../components/Header';
import EventController from '../db/event';

/** @param {import('next').GetServerSidePropsContext} context */
export const getServerSideProps = async function getServerSideProps(context) {
  const user = await getUser(context);
  if (context.req.method !== 'POST') {
    return { props: { user } };
  }

  const id = await EventController.create(user, context.req.body);

  return {
    redirect: {
      destination: `/event/${id}`,
      permanent: false,
    },
  };
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
