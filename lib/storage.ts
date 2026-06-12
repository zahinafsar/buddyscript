import "server-only";
import { randomUUID } from "crypto";
import { Client } from "minio";
import { env } from "./env";

const minio = new Client({
  endPoint: env("MINIO_ENDPOINT"),
  port: Number(env("MINIO_PORT")),
  useSSL: false,
  accessKey: env("MINIO_ACCESS_KEY"),
  secretKey: env("MINIO_SECRET_KEY"),
});

const BUCKET = env("MINIO_BUCKET");

let bucketReady: Promise<void> | null = null;

function ensureBucket() {
  bucketReady ??= (async () => {
    if (!(await minio.bucketExists(BUCKET))) {
      await minio.makeBucket(BUCKET);
    }
    await minio.setBucketPolicy(
      BUCKET,
      JSON.stringify({
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: { AWS: ["*"] },
            Action: ["s3:GetObject"],
            Resource: [`arn:aws:s3:::${BUCKET}/*`],
          },
        ],
      })
    );
  })();
  return bucketReady;
}

export async function uploadImage(
  buffer: Buffer,
  contentType: string,
  ext: string
): Promise<string> {
  await ensureBucket();
  const key = `${randomUUID()}.${ext}`;
  await minio.putObject(BUCKET, key, buffer, buffer.length, {
    "Content-Type": contentType,
  });
  return key;
}

export function publicImageUrl(key: string): string {
  return `http://${env("MINIO_ENDPOINT")}:${env("MINIO_PORT")}/${BUCKET}/${key}`;
}
