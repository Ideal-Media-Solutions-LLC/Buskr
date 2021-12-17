const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

// Initialize the Amazon Cognito credentials provider
const s3 = new S3Client({
  region: process.env.REGION,
  credentials: {
    accessKeyId: process.env.S3_ACCESS,
    secretAccessKey: process.env.S3_SECRET,
  },
});

export default async function upload(keyID, data) {
  const key = `${encodeURIComponent(keyID)}`;
  await s3.send(new PutObjectCommand({
    Bucket: process.env.BUCKET,
    Key: key,
    Body: data,
  }));
  return `https://s3.${process.env.REGION}.amazonaws.com/${process.env.BUCKET}/${key}`;
}
