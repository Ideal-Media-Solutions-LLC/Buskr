import React from 'react';
import CreateEvent from '../components/create-event/CreateEvent';
import { getUser } from '../auth';
import { UserContext } from '../contexts';
import Header from '../components/Header';
import EventController from '../db/event';

const auth = process.env.NEXT_PUBLIC_AUTH_DOMAIN;
const client = process.env.NEXT_PUBLIC_AWS_CLIENT;
const domain = process.env.NEXT_PUBLIC_DOMAIN;

/** @param {import('next').GetServerSidePropsContext} context */
export const getServerSideProps = async function getServerSideProps(context) {
  const user = await getUser(context);
  if (user === null) {
    return {
      redirect: {
        destination: `${auth}/login?response_type=code&client_id=${client}&redirect_uri=${domain}/login`,
        permanent: false,
      },
    };
  }
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

export default function CreatePage({ user }) {
  return (
    <UserContext.Provider value={user}>
      <Header />
      <CreateEvent />
    </UserContext.Provider>
  );
}
