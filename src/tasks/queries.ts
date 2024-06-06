import { HttpError } from "wasp/server";
import {
  type GetHumeConfig,
} from "wasp/server/operations";
import axios from 'axios';

export const getHumeConfig = (async () => {
  const apiKey = process.env.HUME_API_KEY || "";
  const clientSecret = process.env.HUME_CLIENT_SECRET || "";

  const clientId = Buffer.from(`${apiKey}:${clientSecret}`).toString("base64");

  const response = await axios.post(
    'https://api.hume.ai/oauth2-cc/token',
    new URLSearchParams({ grant_type: 'client_credentials' }),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${clientId}`
      }
    }
  );

  const accessToken = response.data.access_token;

  return { accessToken };
}) satisfies GetHumeConfig<void, { accessToken: string }>;
