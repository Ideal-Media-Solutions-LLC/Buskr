import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import db from '.';

// Initialize the Amazon Cognito credentials provider
const s3 = new S3Client({
  region: process.env.REGION,
  credentials: {
    accessKeyId: process.env.S3_ACCESS,
    secretAccessKey: process.env.S3_SECRET,
  },
});

const upload = async function upload(keyID, data) {
  const key = `${encodeURIComponent(keyID)}`;
  await s3.send(new PutObjectCommand({
    Bucket: process.env.BUCKET,
    Key: key,
    Body: data,
  }));
  return `https://s3.${process.env.REGION}.amazonaws.com/${process.env.BUCKET}/${key}`;
};

const createPhotoQuery = `
  INSERT INTO photo (url) VALUES ($1)
  RETURNING id
`;
const createEventPhotoQuery = `
  INSERT INTO event_photo (event_id, photo_id) VALUES ($1, $2)
`;
const create = async function insertPhoto(eventId, photo) {
  // const url = await upload(`event-${eventId}-${i}`, photo);
  const { rows: [{ id: photoId }] } = await db.query({
    name: 'createPhoto',
    text: createPhotoQuery,
    values: [photo],
  });
  await db.query({
    name: 'createEventPhoto',
    text: createEventPhotoQuery,
    values: [eventId, photoId],
  });
};

const PhotoController = { create, upload };

export default PhotoController;
