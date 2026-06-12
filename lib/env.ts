type EnvKey = "AUTH_SECRET";

export function env(name: EnvKey): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} environment variable is not set`);
  }
  return value;
}
