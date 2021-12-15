import db from '.';
import getLocations from './getLocations';

export default async function getEvent(id, limit, offset) {
  const clauses = [];
  const args = [id];

  if (limit !== null) {
    args.push(limit);
    clauses.push(`LIMIT $${args.length}`);
  }

  if (offset !== null) {
    args.push(offset);
    clauses.push(`OFFSET $${args.length}`);
  }

  const query = `
    SELECT
      'Feature' as type,
      jsonb_build_object(
        'type', 'Point',
        'coordinates', ARRAY[ST_X(location::geometry), ST_Y(location::geometry)]
      ) as geometry,
      jsonb_build_object(
        'id', event.id,
        'name', event.name,
        'description', event.description,
        'buskerId', busker.id,
        'buskerName', busker.name,
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
      ) as properties
  FROM event
  LEFT JOIN event_photo ON event_photo.event_id = event.id
  LEFT JOIN photo ON event_photo.photo_id = photo.id
  LEFT JOIN event_tag ON event_tag.event_id = event.id
  LEFT JOIN tag ON event_tag.tag_id = tag.id
  JOIN busker ON busker.id = event.busker_id
  WHERE event.id = $1
  GROUP BY event.id, busker.id
  ORDER BY starts ASC
  ${clauses.join('\n')}
  `;
  const { rows } = await db.query(query, args);
  const [event] = rows;
  if (event !== undefined) {
    await getLocations(rows);
  }
  return event;
}
