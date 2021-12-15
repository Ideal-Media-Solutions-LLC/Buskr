import handler, { HttpException } from '../../handler';
import BuskerController from '../../../db/busker';

/**
 * @param {import('http').IncomingMessage} req
 * @param {import('http').ServerResponse} res
 */
const GET = async function GET(req, res) {
  const id = req.intParam('id');
  const profile = await BuskerController.get(id);
  if (profile === undefined) {
    throw new HttpException(400, 'Profile not found', id);
  }
  res.status(200).json(profile);
};

export default handler({ GET });
