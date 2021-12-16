import db from '.';
import getLocations from './getLocations';
import upload from './upload';

const sqlLocation = function sqlLocation({ lng, lat }) {
  return `SRID=4326;POINT(${lng} ${lat})`;
};

const insertPhoto = async function insertPhoto(eventId, photo) {
  // const url = await upload(`event-${eventId}-${i}`, photo);
  const { rows: [{ id: photoId }] } = await db.query(
    'INSERT INTO photo (url) VALUES ($1) RETURNING id',
    [photo],
  );
  await db.query(
    'INSERT INTO event_photo (event_id, photo_id) VALUES ($1, $2)',
    [eventId, photoId],
  );
};

const insertTag = async function insertTag(eventId, tag) {
  tag = tag.trim().toLowerCase();
  let tagId;
  const { rows: [result] } = await db.query(
    'INSERT INTO tag (name) VALUES ($1) ON CONFLICT DO NOTHING RETURNING id',
    [tag],
  );
  if (result === undefined) {
    const { rows: [{ id }] } = await db.query(
      'SELECT id FROM tag WHERE name = $1',
      [tag],
    );
    tagId = id;
  } else {
    tagId = result.id;
  }
  await db.query(
    'INSERT INTO event_tag (event_id, tag_id) VALUES ($1, $2)',
    [eventId, tagId],
  );
};

const create = async function create(buskerId, {
  name,
  description,
  tags = [],
  starts,
  ends,
  lat,
  lng,
  photos = [],
}) {
  const createQuery = `
    INSERT INTO event (location, name, description, starts, ends, busker_id)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id
  `;
  const { rows: [{ id }] } = await db.query(
    createQuery,
    [sqlLocation({ lng, lat }), name, description, starts, ends, buskerId],
  );
  const promises = [];
  if (!Array.isArray(photos)) {
    photos = [photos];
  }
  for (let i = 0; i < photos.length; i += 1) {
    promises.push(insertPhoto(id, photos[i], i));
  }
  for (const tag of tags) {
    promises.push(insertTag(id, tag));
  }
  await Promise.all(promises);
  return id;
};

const findConflicts = async function findConflicts(
  { lat, lng },
  { from, to },
) {
  const query = `
    SELECT
      location <-> $1 AS distance,
      busker.id,
      busker.email
    FROM event
    JOIN busker ON busker.id = event.busker_id
    WHERE starts >= $2 AND ends <= $3
    ORDER BY distance ASC
  `;
  const { rows } = await db.query(query, [`SRID=4326;POINT(${lng} ${lat})`, from, to]);
  const tooFar = rows.findIndex(row => row.distance > process.env.CONFLICT_METERS);
  if (tooFar !== -1) {
    rows.length = tooFar;
  }
  return rows;
};

const get = async function get(id, limit, offset) {
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
};

const getAll = async function getAll(
  location,
  { from, to },
  limit,
  offset,
  features,
  orderBy,
) {
  const clauses = [];
  const wheres = [];
  const args = [sqlLocation(location)];

  if (from !== null) {
    args.push(from);
    wheres.push(`starts >= $${args.length}`);
  }

  if (to !== null) {
    args.push(to);
    wheres.push(`ends <= $${args.length}`);
  }

  if (limit !== null) {
    args.push(limit);
    clauses.push(`LIMIT $${args.length}`);
  }

  if (offset !== null) {
    args.push(offset);
    clauses.push(`OFFSET $${args.length}`);
  }

  let coordsQuery = '';
  let photosQuery = '';
  let photosJoin = '';
  let tagsQuery = '';
  let tagsJoin = '';
  let getLocation = false;

  for (const feature of features) {
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
        'photos', coalesce(array_agg(DISTINCT photo.url) FILTER (WHERE photo.url IS NOT NULL), '{}'),
      `;
      photosJoin = `
        LEFT JOIN event_photo ON event_photo.event_id = event.id
        LEFT JOIN photo ON event_photo.photo_id = photo.id
      `;
    } else if (feature === 'tags') {
      tagsQuery = `
        'tags', coalesce(array_agg(DISTINCT tag.name) FILTER (WHERE tag.name IS NOT NULL), '{}'),
      `;
      tagsJoin = `
        LEFT JOIN event_tag ON event_tag.event_id = event.id
        LEFT JOIN tag ON event_tag.tag_id = tag.id
      `;
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
    await getLocations(rows);
  }
  return {
    type: 'FeatureCollection',
    features: rows,
  };
};

const Event = { create, findConflicts, get, getAll };

export default Event;
