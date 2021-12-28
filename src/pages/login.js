import axios from 'axios';
import querystring from 'querystring';
import React from 'react';
import { verifyIdToken } from '../auth';
import BuskerController from '../db/busker';

const secret = process.env.AWS_SECRET;
const client_id = process.env.NEXT_PUBLIC_AWS_CLIENT;
const auth = process.env.NEXT_PUBLIC_AUTH_DOMAIN;
const domain = process.env.NEXT_PUBLIC_DOMAIN;

/** @param {import('next').GetServerSidePropsContext} context */
export const getServerSideProps = async function getServerSideProps(context) {
  const authorize = Buffer.from(`${client_id}:${secret}`).toString('base64');
  try {
    const { data: { id_token, expires_in } } = await axios.post(
      `${auth}/oauth2/token`,
      querystring.stringify({
        grant_type: 'authorization_code',
        code: context.query.code,
        client_id,
        redirect_uri: `${domain}/login`,
      }),
      { headers: { Authorization: `Basic ${authorize}` } },
    );

    const idClaims = await verifyIdToken(id_token);

    await BuskerController.update(idClaims);

    context.res.setHeader('Set-Cookie', [
      `id_token=${id_token}`,
      'Secure',
      `Max-Age=${expires_in}`,
    ].join('; '));

    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      redirect: {
        destination: `${auth}/login?response_type=code&client_id=${client_id}&redirect_uri=${domain}/login`,
        permanent: false,
      },
    };
  }
};

export default function Login() {
  return <div>Logging you in...</div>;
}
