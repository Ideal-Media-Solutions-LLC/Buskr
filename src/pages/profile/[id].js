import Profile from '../../components/profile/Profile';
import getProfile from '../../db/getProfile';

export const getStaticProps = async function getStaticProps(context) {
  const performer = await getProfile(context.params.id);
  return performer === undefined ? { notFound: true } : { props: { performer } };
};

export const getStaticPaths = async () => ({ paths: [], fallback: 'blocking' });

export default Profile;
