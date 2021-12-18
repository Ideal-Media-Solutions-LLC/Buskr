import handler, { HttpException } from '../handler';
import EventController from '../../db/event';
import { getUser } from '../../auth';

const validFeatures = new Set([
  'coords',
  'location',
  'photos',
  'tags',
]);

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

  const { features, sort } = req.query;

  const parsedFeatures = features ? features.split(',') : [];

  let orderBy;
  if (sort === undefined || sort === 'distance') {
    orderBy = 'distance';
  } else if (sort === 'time') {
    orderBy = 'starts';
  } else {
    throw new HttpException(400, `unrecognized sort option ${sort}`, sort);
  }

  const invalidFeatures = parsedFeatures
    .filter(feature => !validFeatures.has(feature));

  if (invalidFeatures.length > 0) {
    throw new HttpException(
      400,
      `unrecognized feature: ${invalidFeatures.join(', ')}`,
      invalidFeatures,
    );
  }

  const events = await EventController.getAll({
    lng,
    lat,
    from,
    to,
    limit,
    offset,
    features: parsedFeatures,
    orderBy,
  });
  res.status(200).json(events);
};

/**
 * @param {import('http').IncomingMessage} req
 * @param {import('http').ServerResponse} res
 */
const POST = async function POST(req, res) {
  const { id: buskerId } = await getUser({ req });
  const eventId = await EventController.create(buskerId, req.body);
  res.status(201).json({ id: eventId });
};

export default handler({ GET, POST });
