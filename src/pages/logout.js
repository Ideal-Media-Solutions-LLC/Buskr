import React from 'react';

/** @param {import('next').GetServerSidePropsContext} context */
export const getServerSideProps = async function getServerSideProps(context) {
  context.res.setHeader('Set-Cookie', `id_token=;expires=${new Date(0)}`);

  return {
    redirect: {
      destination: '/',
      permanent: false,
    },
  };
};

export default function Logout() {
  return <div>Logging you out...</div>;
}
