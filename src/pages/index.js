import React from 'react';
import Search from '../components/search/Search';
import { getUser } from '../auth';
import { UserContext } from '../contexts';
import Header from '../components/Header';

export const getServerSideProps = async function getServerSideProps(context) {
  const user = await getUser(context);
  return { props: { user } };
};

const Home = ({ user }) => (
  <UserContext.Provider value={user}>
    <Header />
    <div>
      <Search />
    </div>
  </UserContext.Provider>
);

export default Home;
