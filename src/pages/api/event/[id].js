import db from '../../../db';
import { reverseLookup } from '../../../geocode';

/**
 * @param {import('http').IncomingMessage} req
 * @param {import('http').ServerResponse} res
 */
export default async function handler(req, res) {
  const { id, from, to, limit, offset } = req.query;

  const nId = Number(id);
  if (Number.isNaN(nId)) {
    res.statusCode = 400;
    res.end('invalid id');
    return;
  }

  const clauses = [];
  const args = [nId];
  const wheres = ['event.id = $1'];

  if (from !== undefined) {
    const timestamp = Date.parse(from);
    if (Number.isNaN(timestamp)) {
      res.statusCode = 400;
      res.end('invalid date');
      return;
    }
    args.push(new Date(timestamp));
    wheres.push(`starts >= $${args.length}`);
  }

  if (to !== undefined) {
    const timestamp = Date.parse(to);
    if (Number.isNaN(timestamp)) {
      res.statusCode = 400;
      res.end('invalid date');
      return;
    }
    args.push(new Date(timestamp));
    wheres.push(`ends <= $${args.length}`);
  }

  if (limit !== undefined) {
    const nLimit = Number(limit);
    if (Number.isNaN(nLimit)) {
      res.statusCode = 400;
      res.end('invalid limit');
      return;
    }
    args.push(nLimit);
    clauses.push(`LIMIT $${args.length}`);
  }

  if (offset !== undefined) {
    const nOffset = Number(offset);
    if (Number.isNaN(nOffset)) {
      res.statusCode = 400;
      res.end('invalid offset');
      return;
    }
    args.push(nOffset);
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
  WHERE ${wheres.join('AND')}
  GROUP BY event.id, busker.id
  ORDER BY starts ASC
  ${clauses.join('\n')}
  `;
  const { rows } = await db.query(query, args);

  await Promise.all(rows.map(async (row) => {
    row.properties.location = await reverseLookup(row.properties.id, row.geometry.coordinates);
  }));

  res.status(200).json(rows);
}
