import React from 'react';
import Profile from '../../components/profile/Profile';
import BuskerController from '../../db/busker';
import { getUser } from '../../auth';
import { UserContext } from '../../contexts';
import Header from '../../components/Header';

/** @param {import('next').GetServerSidePropsContext} context */
export const getServerSideProps = async function getServerSideProps(context) {
  const [user, performer] = await Promise.all([
    getUser(context),
    BuskerController.get(context.params.id),
  ]);
  return performer === undefined ? { notFound: true } : { props: { performer, user } };
};

export default function ProfilePage({ performer, user }) {
  return (
    <UserContext.Provider value={user}>
      <Header />
      <Profile performer={performer} />
    </UserContext.Provider>
  );
}
