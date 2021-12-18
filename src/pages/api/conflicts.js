import handler from '../handler';
import EventController from '../../db/event';

/**
 * @param {import('http').IncomingMessage} req
 * @param {import('http').ServerResponse} res
 */
const GET = async function GET(req, res) {
  const lat = req.numParam('lat');
  const lng = req.numParam('lng');
  const from = req.dateParam('from', null);
  const to = req.dateParam('to', null);
  const dist = req.intParam('dist', process.env.CONFLICT_METERS);

  const conflicts = await EventController.findConflicts({ lng, lat, from, to, dist });

  res.status(200).json(conflicts);
};

export default handler({ GET });
