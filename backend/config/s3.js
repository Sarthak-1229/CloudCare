const { S3Client, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');

const region = process.env.AWS_REGION || 'ap-south-1';
const bucket = process.env.S3_BUCKET || 'cloudcare-docs-anushka-unique-03';

let s3Client = null;

function getS3Client() {
  if (!s3Client) {
    s3Client = new S3Client({ region });
  }
  return s3Client;
}

// Memory fallback store for local testing
const memoryS3 = new Map();

async function uploadPdf(s3Key, fileBuffer, contentType = 'application/pdf') {
  if (process.env.NODE_ENV === 'test-memory' || !process.env.S3_BUCKET) {
    memoryS3.set(s3Key, { buffer: fileBuffer, contentType });
    return { key: s3Key, location: `memory://${bucket}/${s3Key}` };
  }

  const client = getS3Client();
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: s3Key,
    Body: fileBuffer,
    ContentType: contentType,
    ServerSideEncryption: 'AES256'
  });

  await client.send(command);
  return { key: s3Key, bucket };
}

async function getPdfStream(s3Key) {
  if (memoryS3.has(s3Key)) {
    const item = memoryS3.get(s3Key);
    const { Readable } = require('node:stream');
    return {
      stream: Readable.from(item.buffer),
      contentType: item.contentType
    };
  }

  const client = getS3Client();
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: s3Key
  });

  const response = await client.send(command);
  return {
    stream: response.Body,
    contentType: response.ContentType || 'application/pdf'
  };
}

module.exports = {
  getS3Client,
  uploadPdf,
  getPdfStream,
  bucket
};
