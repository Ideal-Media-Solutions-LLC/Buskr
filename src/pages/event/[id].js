import React from 'react';
import Event from '../../components/Event';

/**
 * @param {import('next').GetServerSidePropsContext} context
 * @returns {import('next').GetServerSidePropsResult}
 */
export const getStaticProps = async function getStaticProps(context) {
  const { id } = context.query;
  const event = await Event.get(id);
  return event === undefined ? { notFound: true } : { props: { event } };
};

export const getStaticPaths = async () => ({ paths: [], fallback: 'blocking' });

const EventRenderer = ({ event }) => <Event event={event} />;

export default EventRenderer;
