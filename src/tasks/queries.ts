import { HttpError } from "wasp/server";
import {
  type GetPosthogConfig,
  type GetHumeConfig,
} from "wasp/server/operations";
import { execSync } from "child_process";

export const getPosthogConfig = (() => {
  console.log("getPosthogConfig called");
  const config = {
    apiKey: process.env.PUBLIC_POSTHOG_KEY || "",
    apiHost: process.env.PUBLIC_POSTHOG_HOST || "https://eu.i.posthog.com",
  };
  return config;
}) satisfies GetPosthogConfig<void, { apiKey: string; apiHost: string }>;

export const getHumeConfig = (() => {

  const apiKey = process.env.HUME_API_KEY || "";
  const clientSecret = process.env.HUME_CLIENT_SECRET || "";

  const clientId = Buffer.from(`${apiKey}:${clientSecret}`).toString("base64");

  const response =
    execSync(`curl -s --location 'https://api.hume.ai/oauth2-cc/token' \
    --header 'Content-Type: application/x-www-form-urlencoded' \
    --header "Authorization: Basic ${clientId}" \
    --data-urlencode 'grant_type=client_credentials'`);

  const accessToken = JSON.parse(response.toString()).access_token;

  return { accessToken };
}) satisfies GetHumeConfig<void, { accessToken: string }>;
