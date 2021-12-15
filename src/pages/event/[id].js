import React from 'react';
import Event from '../../components/Event';
import getEvent from '../../db/getEvent';

/**
 * @param {import('next').GetServerSidePropsContext} context
 * @returns {import('next').GetServerSidePropsResult}
 */
export const getStaticProps = async function getStaticProps(context) {
  const { id } = context.query;
  const event = await getEvent(id);
  return event === undefined ? { notFound: true } : { props: { event } };
};

const EventRenderer = ({ event }) => <Event event={event} />;

export default EventRenderer;
