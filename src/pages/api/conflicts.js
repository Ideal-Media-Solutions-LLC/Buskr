import handler from '../handler';
import EventController from '../../db/event';

const defaultDist = Number(process.env.NEXT_PUBLIC_CONFLICT_METERS);

/**
 * @param {import('http').IncomingMessage} req
 * @param {import('http').ServerResponse} res
 */
const GET = async function GET(req, res) {
  const lat = req.numParam('lat');
  const lng = req.numParam('lng');
  const from = req.dateParam('from', null);
  const to = req.dateParam('to', null);
  const dist = req.intParam('dist', defaultDist);

  const conflicts = await EventController.findConflicts({ lng, lat, from, to, dist });

  res.status(200).json(conflicts);
};

export default handler({ GET });
