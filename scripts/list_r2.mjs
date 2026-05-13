import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';

const s3 = new S3Client({
  region: 'auto',
  endpoint: 'https://0a28250e63bf217f833feabaf84a25a1.r2.cloudflarestorage.com',
  credentials: {
    accessKeyId: '85ce72a83ce9a15eaa334591e278e514',
    secretAccessKey: 'f94efec54d376d7e82c3bf47f9e388af251760e57e55ddfabc14088669c5e62c',
  },
});

const result = await s3.send(new ListObjectsV2Command({
  Bucket: 'tripcngo-assets',
  Prefix: 'dish_images/',
  MaxKeys: 20,
}));
console.log('Objects:', JSON.stringify((result.Contents || []).map(o => o.Key), null, 2));
