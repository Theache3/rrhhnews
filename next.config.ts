import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["typeorm", "mssql", "reflect-metadata", "exceljs"],
};

export default nextConfig;
