import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Skip generating the extra agent rule files.
  agentRules: false,
};

export default nextConfig;
