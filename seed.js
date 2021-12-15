/* eslint import/no-extraneous-dependencies: ["off"] */
require('dotenv').config({ path: '.env.local' });
const { Client } = require('pg');
const {
  datatype: { float, number },
  date: { between },
  lorem: { sentences, words },
  image: { city, people },
  name: { findName },
} = require('faker');

const {
  RDS_USERNAME,
  RDS_PASSWORD,
  RDS_HOSTNAME,
  RDS_DB_NAME,
  RDS_PORT,
} = process.env;

const db = new Client({
  user: RDS_USERNAME,
  password: RDS_PASSWORD,
  host: RDS_HOSTNAME,
  database: RDS_DB_NAME,
  port: RDS_PORT,
});

const args = process.argv;
console.log(args);
const numBuskers = Number(args[2]);
const [lng, lat] = args[3].split(',').map(Number);
console.log(args[3].split(','));
console.log(lng, lat);
const maxDist = Number(args[4]);
const distRange = { min: -maxDist, max: maxDist };

const dist = function dist(start) {
  return float(distRange) + start;
};

const coords = function coords() {
  return `SRID=4326;POINT(${dist(lng)} ${dist(lat)})`;
};

const tags = [
  'music',
  'dance',
  'mime',
  'acrobatics',
  'poetry',
  'clowns',
  'magic',
  'puppet show',
  'juggling',
  'living statue',
  'comedy',
];

const maxEvents = 10;
const maxTags = 5;
const maxPhotos = 4;
const minTime = new Date();
const maxTime = new Date();
maxTime.setMonth(maxTime.getMonth() + 2);

const insertTag = async function insertTag(tag) {
  return db.query(
    'INSERT INTO tag (name) VALUES ($1) ON CONFLICT DO NOTHING',
    [tag],
  );
};

const insertPhoto = async function insertPhoto(eventId) {
  const { rows: [{ id }] } = await db.query(
    'INSERT INTO photo (url) VALUES ($1) RETURNING id',
    [city()],
  );
  return db.query(
    'INSERT INTO event_photo (event_id, photo_id) VALUES ($1, $2)',
    [eventId, id],
  );
};

const generate = async function generate(amount, generator) {
  const promises = Array(amount).fill(undefined).map(generator);

  return Promise.all(promises);
};

const createEvent = async function createEvent(buskerId) {
  const starts = between(minTime, maxTime);
  const ends = new Date(starts);
  ends.setMinutes(ends.getMinutes() + number(120));
  const { rows: [{ id }] } = await db.query(
    `INSERT INTO event (location, name, description, starts, ends, busker_id)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id`,
    [coords(), words(), sentences(), starts, ends, buskerId],
  );
  const promises = [generate(number(maxPhotos), () => insertPhoto(id))];
  const used = [];
  for (let i = 0; i < number(maxTags); i += 1) {
    const tag = number(tags.length - 1);
    if (!used[tag]) {
      used[tag] = true;
      promises.push(
        db.query(
          'UPDATE tag SET popularity = POPULARITY + 1 WHERE id = $1',
          [tag + 1],
        ),
      );
      promises.push(
        db.query(
          'INSERT INTO event_tag (event_id, tag_id) VALUES ($1, $2)',
          [id, tag + 1],
        ),
      );
    }
  }
  return Promise.all(promises);
};

const createBusker = async function createBusker() {
  const { rows: [{ id }] } = await db.query(
    'INSERT INTO busker (name, photo, bio) VALUES ($1, $2, $3) RETURNING id',
    [findName(), people(), sentences()],
  );

  return generate(number(maxEvents), () => createEvent(id));
};

const main = async function main() {
  await db.connect();
  await Promise.all(tags.map(insertTag));
  await generate(numBuskers, createBusker);
  await db.end();
};

main().catch(console.error);
