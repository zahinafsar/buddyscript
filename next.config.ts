import type { NextConfig } from "next";
import { nextTsApi } from "next-ts-api/config";

const withNextTsApi = nextTsApi({
  dir: "app/api",
  outDir: "types",
  outFile: "next-ts-api.ts",
});

const nextConfig: NextConfig = {};

export default withNextTsApi(nextConfig);
