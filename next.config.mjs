import { withSentryConfig } from "@sentry/nextjs";

/** @type {import('next').NextConfig} */
const nextConfig = {};

export default withSentryConfig(nextConfig, {
  org: "keep-it-real-cj",
  project: "gazette",
  silent: !process.env.CI,
});
