import type { NextConfig } from "next";

const nextConfig: NextConfig = {
 webpack: (config) => {
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      type: 'asset/source',
    });
    
    return config;
  }, /* config options here */
};

export default nextConfig;
