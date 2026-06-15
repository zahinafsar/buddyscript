type EnvKey =
  | "AUTH_SECRET"
  | "DATABASE_URL"
  | "MINIO_ENDPOINT"
  | "MINIO_PORT"
  | "MINIO_ACCESS_KEY"
  | "MINIO_SECRET_KEY"
  | "MINIO_BUCKET"
  | "MINIO_PUBLIC_URL";

export function env(name: EnvKey): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} environment variable is not set`);
  }
  return value;
}
