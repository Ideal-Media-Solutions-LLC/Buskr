import handler, { HttpException } from '../../handler';
import EventController from '../../db/event';
import { getUser } from '../../auth';

const defaultDist = Number(process.env.NEXT_PUBLIC_VISIBLE_METERS);

/**
 * @param {import('http').IncomingMessage} req
 * @param {import('http').ServerResponse} res
 */
const GET = async function GET(req, res) {
  const center = { lng: req.numParam('lng'), lat: req.numParam('lat') };
  const dist = req.intParam('dist', defaultDist);
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

  const events = await EventController.getMany({
    center,
    dist,
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
  const { body } = req;
  if (!body.name) {
    throw new HttpException(400, 'missing name');
  }
  if (!body.description) {
    throw new HttpException(400, 'missing name');
  }
  const starts = new Date(req.body.starts);
  const ends = new Date(req.body.ends);
  if (ends < starts || starts < new Date()) {
    throw new HttpException(422, 'out-of-bounds date');
  }
  const user = await getUser({ req });
  const eventId = await EventController.create(user, body);
  res.status(201).json({ id: eventId });
};

export default handler({ GET, POST });
