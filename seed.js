/* eslint import/no-extraneous-dependencies: ["off"] */
require('dotenv').config({ path: '.env.local' });
const { Client } = require('pg');
const {
  datatype: { float, number, uuid },
  date: { between },
  lorem: { sentences, words },
  image: { city, people },
  internet: { email },
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

const numBuskers = 50;
const lng = -73.986301;
const lat = 40.7579586;

const maxDist = 0.01;
const distRange = { min: -maxDist, max: maxDist };

const dist = function dist(start) {
  return Math.random() * maxDist * 2 - maxDist + start;
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
maxTime.setDate(maxTime.getDate() + 1);

const insertTag = async function insertTag(tag) {
  return db.query(
    'INSERT INTO tag (name) VALUES ($1) ON CONFLICT DO NOTHING',
    [tag],
  );
};

const insertStock = async function insertPhoto(url) {
  return db.query(
    'INSERT INTO photo (url) VALUES ($1)',
    [url],
  );
};

const stockPhotos = [
  'https://cdn.discordapp.com/attachments/920760358753419264/920760423500877844/busker2.jpeg',
  'https://cdn.discordapp.com/attachments/920760358753419264/920760423727394826/busker.jpeg',
];

let photoI = 0;

const insertPhoto = async function insertPhoto(eventId) {
  console.log(eventId);
  if (photoI < 2) {
    await db.query(
      'INSERT INTO photo (url) VALUES ($1)',
      [stockPhotos[photoI]],
    );
  }
  const photo = photoI % 2;
  photoI += 1;
  return db.query(
    'INSERT INTO event_photo (event_id, photo_id) VALUES ($1, $2)',
    [eventId, 1 + photo],
  );
};

const generate = async function generate(amount, generator) {
  /*
  const promises = Array(amount).fill(undefined).map(generator);

  return Promise.all(promises);
  */
  const results = [];
  for (let i = 0; i < amount; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    results.push(await generator());
  }
  return results;
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
  const promises = [generate(1, () => insertPhoto(id))];
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
  const { rows: [{ id }] } = await db.query(`
    INSERT INTO busker (id, name, email, photo, bio)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id`, [uuid(), findName(), email(), people(), sentences()]);

  return generate(number(maxEvents), () => createEvent(id));
};

const main = async function main() {
  await db.connect();
  await Promise.all(tags.map(insertTag));
  await Promise.all(stockPhotos.map(insertStock));
  await generate(numBuskers, createBusker);
  await db.end();
};

main().catch(console.error);
