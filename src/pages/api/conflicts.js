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

  const conflicts = await EventController.findConflicts({ lat, lng }, { from, to });

  res.status(200).json(conflicts.length !== 0);
};

export default handler({ GET });
