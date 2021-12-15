import React from 'react';
import Event from '../../components/Event';
import EventController from '../../db/event';
import { getUser } from '../../auth';
import { UserContext } from '../../contexts';

export const getServerSideProps = async function getServerSideProps(context) {
  const [user, event] = await Promise.all([
    getUser(context),
    EventController.get(context.params.id),
  ]);
  return event === undefined ? { notFound: true } : { props: { event, user } };
};

const EventPage = ({ event, user }) => (
  <UserContext.Provider value={user}>
    <Event event={event} />
  </UserContext.Provider>
);

export default EventPage;
