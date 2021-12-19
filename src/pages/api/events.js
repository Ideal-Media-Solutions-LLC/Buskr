import handler, { HttpException } from '../handler';
import EventController from '../../db/event';
import { getUser } from '../../auth';

/**
 * @param {import('http').IncomingMessage} req
 * @param {import('http').ServerResponse} res
 */
const GET = async function GET(req, res) {
  const lat = req.numParam('lat');
  const lng = req.numParam('lng');
  const from = req.dateParam('from', null);
  const to = req.dateParam('to', null);
  const limit = req.intParam('limit', null);
  const offset = req.intParam('offset', null);

  const { search, sort } = req.query;

  let orderBy;
  if (sort === undefined || sort === 'distance') {
    orderBy = 'distance';
  } else if (sort === 'time') {
    orderBy = 'starts';
  } else {
    throw new HttpException(400, `unrecognized sort option ${sort}`, sort);
  }

  const events = await EventController.getAll({
    lng,
    lat,
    from,
    to,
    limit,
    offset,
    search,
    orderBy,
  });

  res.status(200).json(events);
};

/**
 * @param {import('http').IncomingMessage} req
 * @param {import('http').ServerResponse} res
 */
const POST = async function POST(req, res) {
  const user = await getUser({ req });
  const eventId = await EventController.create(user, req.body);
  res.status(201).json({ id: eventId });
};

export default handler({ GET, POST });
