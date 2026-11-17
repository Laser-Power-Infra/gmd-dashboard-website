/**
 * Uploads every photo in public/purchase img/ to S3 under purchase-img/<same file name>,
 * then checks one public URL so we know imageUrl links will actually load.
 *
 *   node scripts/upload-purchase-images.mjs
 *
 * Needs AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, AWS_ENDPOINT_URL_S3, AWS_S3_BUCKET in .env.
 */
import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const { AWS_REGION, AWS_ENDPOINT_URL_S3, AWS_S3_BUCKET } = process.env;
if (!AWS_S3_BUCKET || !AWS_ENDPOINT_URL_S3) {
  console.error('Set AWS_S3_BUCKET and AWS_ENDPOINT_URL_S3 in .env');
  process.exit(1);
}

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dir = path.join(root, 'public', 'purchase img');
const files = fs.readdirSync(dir).filter((f) => f.toLowerCase().endsWith('.webp'));

const s3 = new S3Client({ region: AWS_REGION, endpoint: AWS_ENDPOINT_URL_S3, forcePathStyle: true });
for (const f of files) {
  await s3.send(
    new PutObjectCommand({
      Bucket: AWS_S3_BUCKET,
      Key: `purchase-img/${f}`,
      Body: fs.readFileSync(path.join(dir, f)),
      ContentType: 'image/webp',
    })
  );
  console.log(`uploaded purchase-img/${f}`);
}

const base = `${AWS_ENDPOINT_URL_S3.replace(/\/+$/, '')}/${AWS_S3_BUCKET}/purchase-img`;
const probe = `${base}/${encodeURIComponent(files[0])}`;
const res = await fetch(probe, { method: 'HEAD' });
console.log(`\n${files.length} files uploaded. Base URL: ${base}`);
console.log(`public check ${res.status} ${probe}`);
if (!res.ok) {
  console.error('Public URL is not readable - the bucket is not public; image links would be broken.');
  process.exit(1);
}
