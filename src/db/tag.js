import db from '.';

const getAllQuery = `
  SELECT name FROM tag
  ORDER BY popularity DESC
`;
const getManyQuery = `
  ${getAllQuery}
  LIMIT $1
`;

const getMany = async function getMany(limit) {
  const query = limit === undefined
    ? { name: 'getAll', text: getAllQuery }
    : { name: 'getMany', text: getManyQuery, values: [limit] };
  const { rows } = await db.query(query);
  return rows.map(({ name }) => name);
};

const createTagQuery = `
  INSERT INTO tag (name, popularity)
  VALUES ($1, 1)
  ON CONFLICT (name) DO UPDATE SET popularity = tag.popularity + 1
  RETURNING id
`;
const findTagQuery = `
  SELECT id FROM tag WHERE name = $1
`;
const createEventTagQuery = `
  INSERT INTO event_tag (event_id, tag_id) VALUES ($1, $2)
`;
const create = async function insert(eventId, tag) {
  tag = tag.trim().toLowerCase();
  if (!tag) {
    return;
  }
  let tagId;
  const { rows: [result] } = await db.query({
    name: 'createTag',
    text: createTagQuery,
    values: [tag],
  });
  if (result === undefined) {
    const { rows: [{ id }] } = await db.query({
      name: 'findTag',
      text: findTagQuery,
      values: [tag],
    });
    tagId = id;
  } else {
    tagId = result.id;
  }
  await db.query({
    name: 'createEventTag',
    text: createEventTagQuery,
    values: [eventId, tagId],
  });
};

const TagController = { create, getMany };
export default TagController;
