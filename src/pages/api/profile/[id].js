import handler, { HttpException } from '../../handler';
import getProfile from '../../../db/getProfile';

/**
 * @param {import('http').IncomingMessage} req
 * @param {import('http').ServerResponse} res
 */
const GET = async function GET(req, res) {
  const id = req.intParam('id');
  const profile = await getProfile(id);
  if (profile === undefined) {
    throw new HttpException(400, 'Profile not found', id);
  }
  res.status(200).json(profile);
};

export default handler({ GET });
