import React from 'react';
import Profile from '../../components/profile/Profile';
import BuskerController from '../../db/busker';
import { getUser } from '../../auth';
import { UserContext } from '../../contexts';

export const getServerSideProps = async function getServerSideProps(context) {
  const [user, performer] = await Promise.all([
    getUser(context),
    BuskerController.get(context.params.id),
  ]);
  return performer === undefined ? { notFound: true } : { props: { performer, user } };
};

const ProfilePage = ({ performer, user }) => (
  <UserContext.Provider value={user}>
    <Profile performer={performer} />
  </UserContext.Provider>
);

export default ProfilePage;
