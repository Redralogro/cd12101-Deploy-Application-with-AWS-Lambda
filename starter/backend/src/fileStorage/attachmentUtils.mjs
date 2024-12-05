import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export const generateImageUrl = async (id) => {
  const s3Client = new S3Client();
  const command = new PutObjectCommand({
    Bucket: process.env.ATTACHMENT_S3_BUCKET,
    Key: id,
  });

  const signedUrl = await getSignedUrl(s3Client, command, {
    expiresIn: parseInt(process.env.SIGNED_URL_EXPIRATION, 10),
  });

  return signedUrl;
};