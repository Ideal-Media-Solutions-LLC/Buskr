import { db, getLocations, handler } from '../../../../endpoint';

/**
 * @param {import('http').IncomingMessage} req
 * @param {import('http').ServerResponse} res
 */
const GET = async function GET(req, res) {
  const id = req.intParam('id');

  const query = `
    WITH busker_events AS (
    SELECT
      busker_id,
      jsonb_build_object(
        'type', 'Feature',
        'geometry', jsonb_build_object(
          'type', 'Point',
          'coordinates', ARRAY[ST_X(location::geometry), ST_Y(location::geometry)]
        ),
        'properties', jsonb_build_object(
          'id', event.id,
          'name', event.name,
          'description', event.description,
          'photos', coalesce(
            array_agg(DISTINCT photo.url) FILTER (WHERE photo.url IS NOT NULL),
            '{}'
          ),
          'tags', coalesce(
            array_agg(DISTINCT tag.name) FILTER (WHERE tag.name IS NOT NULL),
            '{}'
          ),
          'starts', event.starts,
          'ends', event.ends
        )
      ) as eventObj
    FROM event
    LEFT JOIN event_photo ON event_photo.event_id = event.id
    LEFT JOIN photo ON event_photo.photo_id = photo.id
    LEFT JOIN event_tag ON event_tag.event_id = event.id
    LEFT JOIN tag ON event_tag.tag_id = tag.id
    WHERE event.ends >= now()
    GROUP BY event.id
    ORDER BY starts ASC
  )
  SELECT
    busker.id,
    busker.name,
    busker.photo,
    busker.bio,
    coalesce(array_agg(eventObj), '{}') as events
  FROM busker
  LEFT JOIN busker_events
  ON busker_events.busker_id = busker.id
  WHERE busker.id = $1
  GROUP BY busker.id
  `;
  const { rows: [profile] } = await db.query(query, [id]);
  await getLocations(profile.events);
  res.status(200).json(profile);
};

export default handler({ GET });
