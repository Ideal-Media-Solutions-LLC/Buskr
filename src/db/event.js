import db from '.';
import getLocations from './getLocations';
import { loadDates } from '../interface';

const generateSearch = (event, user, tags) => [
  ...tags,
  event.name,
  event.description,
  user.name,
].join(' ');

const sqlLocation = function sqlLocation({ lng, lat }) {
  return `SRID=4326;POINT(${lng} ${lat})`;
};

const insertPhotoQuery = `
  INSERT INTO photo (url) VALUES ($1)
  RETURNING id
`;
const insertEventPhotoQuery = `
  INSERT INTO event_photo (event_id, photo_id) VALUES ($1, $2)
`;
const insertPhoto = async function insertPhoto(eventId, photo) {
  // const url = await upload(`event-${eventId}-${i}`, photo);
  const { rows: [{ id: photoId }] } = await db.query({
    name: 'insertPhoto',
    text: insertPhotoQuery,
    values: [photo],
  });
  await db.query({
    name: 'insertEventPhoto',
    text: insertEventPhotoQuery,
    values: [eventId, photoId],
  });
};

const insertTagQuery = `
    INSERT INTO tag (name, popularity)
    VALUES ($1, 1)
    ON CONFLICT UPDATE popularity = popularity + 1
    RETURNING id
`;
const selectTagQuery = `
  SELECT id FROM tag WHERE name = $1
`;
const insertEventTagQuery = `
  INSERT INTO event_tag (event_id, tag_id) VALUES ($1, $2)
`;
const insertTag = async function insertTag(eventId, tag) {
  tag = tag.trim().toLowerCase();
  if (!tag) {
    return;
  }
  let tagId;
  const { rows: [result] } = await db.query({
    name: 'insertTag',
    text: insertTagQuery,
    values: [tag],
  });
  if (result === undefined) {
    const { rows: [{ id }] } = await db.query({
      name: 'selectTag',
      text: selectTagQuery,
      values: [tag],
    });
    tagId = id;
  } else {
    tagId = result.id;
  }
  await db.query({
    name: 'insertEventTag',
    text: insertEventTagQuery,
    values: [eventId, tagId],
  });
};

const createEventQuery = `
  INSERT INTO event (location, name, description, starts, ends, busker_id, search)
  VALUES ($1, $2, $3, $4, $5, $6, to_tsvector('english', $7)
  RETURNING id
`;
const create = async function create(user, {
  name,
  description,
  center,
  tags = [],
  starts,
  ends,
  photos = [],
}) {
  const search = generateSearch({ name, description }, user, tags);
  const { rows: [{ id }] } = await db.query({
    name: 'createEvent',
    text: createEventQuery,
    values: [sqlLocation(center), name, description, starts, ends, user.id, search],
  });
  const promises = [];
  for (let i = 0; i < photos.length; i += 1) {
    promises.push(insertPhoto(id, photos[i], i));
  }
  for (const tag of tags) {
    promises.push(insertTag(id, tag));
  }
  await Promise.all(promises);
  return id;
};

const findConflictsQuery = `
  SELECT
    location <-> $1 AS distance,
    busker.id,
    busker.email
  FROM event
  JOIN busker ON busker.id = event.busker_id
  WHERE starts >= $2 AND ends <= $3
  ORDER BY distance ASC
`;
const findConflicts = async function findConflicts({ center, from, to, dist }) {
  const { rows } = await db.query({
    name: 'findConflicts',
    text: findConflictsQuery,
    values: [sqlLocation(center), from, to],
  });
  const tooFar = rows.findIndex(row => row.distance > dist);
  if (tooFar !== -1) {
    rows.length = tooFar;
  }
  return rows;
};

const findDates = async function findDates({ center, dist, offset, search }) {
  const query = `
    SELECT DISTINCT (starts AT TIME ZONE INTERVAL '${-offset} minutes')::date AS month
    FROM event
    WHERE location <-> $1 < $2
    ${search ? 'AND search @@ websearch_to_tsquery(\'english\', $3)' : ''}
  `;
  const args = [sqlLocation(center), dist];
  if (search) {
    args.push(search);
  }
  const { rows } = await db.query(query, args);
  return rows.map(({ month }) => month);
};

const getEventQuery = `
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
`;
const get = async function get(id) {
  const { rows } = await db.query({
    name: 'getEvent',
    text: getEventQuery,
    values: [id],
  });
  const [event] = rows;
  loadDates(event);
  if (event !== undefined) {
    await getLocations(rows);
  }
  return event;
};

const getAll = async function getAll({
  center,
  from,
  to,
  limit,
  offset,
  orderBy,
  search,
  dist,
}) {
  const clauses = [];
  const wheres = ['location <-> $1 < $2'];
  const args = [sqlLocation(center), dist];

  if (from) {
    args.push(from);
    wheres.push(`starts >= $${args.length}`);
  }

  if (to) {
    args.push(to);
    wheres.push(`ends <= $${args.length}`);
  }

  if (search) {
    args.push(search);
    wheres.push(`search @@ websearch_to_tsquery('english', $${args.length})`);
  }

  if (typeof limit === 'number') {
    args.push(limit);
    clauses.push(`LIMIT $${args.length}`);
  }

  if (offset !== null) {
    args.push(offset);
    clauses.push(`OFFSET $${args.length}`);
  }

  const query = `
    SELECT
      location <-> $1 AS distance,
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
    WHERE ${wheres.join(' AND ')}
    GROUP BY event.id, busker.id
    ORDER BY ${orderBy} ASC
    ${clauses.join('\n    ')}
  `;
  const { rows } = await db.query(query, args);

  await getLocations(rows);

  for (const event of rows) {
    loadDates(event);
  }

  return rows;
};

};

const Event = { create, findConflicts, get, getAll };

export default Event;
