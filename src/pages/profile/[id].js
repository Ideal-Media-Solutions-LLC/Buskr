import Profile from '../../components/profile/Profile';
import Busker from '../../db/busker';

export const getStaticProps = async function getStaticProps(context) {
  const performer = await Busker.get(context.params.id);
  return performer === undefined ? { notFound: true } : { props: { performer } };
};

export const getStaticPaths = async () => ({ paths: [], fallback: 'blocking' });

export default Profile;
