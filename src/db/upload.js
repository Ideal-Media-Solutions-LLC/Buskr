const {
  CognitoIdentityClient,
  fromCognitoIdentityPool,
} = require('@aws-sdk/client-cognito-identity');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

const { BUCKET, IDENTITY_POOL, REGION: region } = process.env;

// Initialize the Amazon Cognito credentials provider
const s3 = new S3Client({
  region,
  credentials: fromCognitoIdentityPool({
    client: new CognitoIdentityClient({ region }),
    identityPoolId: IDENTITY_POOL,
  }),
});

export default async function upload(filetype, keyID, data) {
  const key = `${encodeURIComponent(keyID)}.${filetype}`;
  await s3.send(new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: data,
  }));
  return `https://s3.${region}.amazonaws.com/${key}`;
}
