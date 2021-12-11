import db from '../../db';
import { reverseLookup } from '../../geocode';

/**
 * @param {import('http').IncomingMessage} req
 * @param {import('http').ServerResponse} res
 */
export default async function handler(req, res) {
  const { features, lat, lng, from, to, limit, offset, sort } = req.query;

  const latitude = Number(lat);
  const longitude = Number(lng);

  if (
    lat === undefined || lng === undefined
    || Number.isNaN(latitude) || Number.isNaN(longitude)
  ) {
    res.statusCode = 400;
    res.end('invalid coordinates');
    return;
  }

  const clauses = [];
  const wheres = [];
  const args = [`SRID=4326;POINT(${longitude} ${latitude})`];

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

  let orderBy;
  if (sort === undefined || sort === 'distance') {
    orderBy = 'distance';
  } else if (sort === 'time') {
    orderBy = 'starts';
  } else {
    res.statusCode = 400;
    res.end('"sort" must be either "distance" or "time"');
  }

  let coordsQuery = '';
  let photosQuery = '';
  let photosJoin = '';
  let tagsQuery = '';
  let tagsJoin = '';
  let getLocation = false;

  if (features !== undefined) {
    for (const feature of features.split(',')) {
      if (feature === 'coords') {
        coordsQuery = `
          'Feature' as type,
          jsonb_build_object(
            'type', 'Point',
            'coordinates', ARRAY[ST_X(location::geometry), ST_Y(location::geometry)]
          ) as geometry,
        `;
      } else if (feature === 'location') {
        getLocation = true;
      } else if (feature === 'photos') {
        photosQuery = `
          'photos', coalesce(array_agg(photo.url) FILTER (WHERE photo.url IS NOT NULL), '{}'),
        `;
        photosJoin = `
          LEFT JOIN event_photo ON event_photo.event_id = event.id
          LEFT JOIN photo ON event_photo.photo_id = photo.id
        `;
      } else if (feature === 'tags') {
        tagsQuery = `
          'tags', coalesce(array_agg(tag.name) FILTER (WHERE tag.name IS NOT NULL), '{}'),
        `;
        tagsJoin = `
          LEFT JOIN event_tag ON event_tag.event_id = event.id
          LEFT JOIN tag ON event_tag.tag_id = tag.id
        `;
      } else {
        res.statusCode = 400;
        res.end(`unrecognized feature ${feature}`);
        return;
      }
    }
  }

  const query = `
    SELECT
      location <-> $1 AS distance,
      ${coordsQuery}
      jsonb_build_object(
        'id', event.id,
        'name', event.name,
        'description', event.description,
        'buskerId', busker.id,
        'buskerName', busker.name,
        ${photosQuery}
        ${tagsQuery}
        'starts', event.starts,
        'ends', event.ends
      ) as properties
    FROM event
    ${photosJoin}
    ${tagsJoin}
    JOIN busker ON busker.id = event.busker_id
    ${wheres.length > 0 ? `WHERE ${wheres.join(' AND ')}` : ''}
    GROUP BY event.id, busker.id
    ORDER BY ${orderBy} ASC
    ${clauses.join('\n    ')}
  `;
  const { rows } = await db.query(query, args);

  if (getLocation) {
    await Promise.all(rows.map(async (row) => {
      row.properties.location = await reverseLookup(row.properties.id, row.geometry.coordinates).catch((e) => console.error(e.response.data));
    }));
  }

  res.status(200).json(rows);
}
