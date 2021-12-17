import React from 'react';
import Search from '../components/search/Search';
import { getUser } from '../auth';
<<<<<<< HEAD
import { UserContext } from '../contexts';
=======
import { UserContext, BarViewContext } from '../contexts';
>>>>>>> 0a11943ae0972765ce271324209f335930a6618e
import Header from '../components/Header';

export const getServerSideProps = async function getServerSideProps(context) {
  const user = await getUser(context);
  return { props: { user } };
};

const Home = ({ user }) => (
  <UserContext.Provider value={user}>
<<<<<<< HEAD
    <Header />
    <div>
      <Search />
    </div>
=======
      <Header />
      <div>
        <Search />
      </div>
>>>>>>> 0a11943ae0972765ce271324209f335930a6618e
  </UserContext.Provider>
);

export default Home;
