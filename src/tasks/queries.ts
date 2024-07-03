import { HttpError } from "wasp/server";
import {
  type GetAccessToken,
  type GetChatGroups,
  type GetChats,
  type GetChatEvents,
} from "wasp/server/operations";
import axios from "axios";

export const getAccessToken = (async (args, context) => {
  try {
    const apiKey = process.env.HUME_API_KEY || "";
    const clientSecret = process.env.HUME_CLIENT_SECRET || "";

    const clientId = Buffer.from(`${apiKey}:${clientSecret}`).toString(
      "base64"
    );

    const response = await axios.post(
      "https://api.hume.ai/oauth2-cc/token",
      new URLSearchParams({ grant_type: "client_credentials" }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${clientId}`,
        },
      }
    );

    const accessToken = response.data.access_token;
    console.log("Access token retrieved successfully");

    return { accessToken };
  } catch (error) {
    console.error("Error retrieving access token:", error);
    throw new HttpError(500, "Failed to retrieve access token");
  }
}) satisfies GetAccessToken<void, { accessToken: string }>;

export const getChatGroups = async (
  pageNumber: number = 0,
  pageSize: number = 10,
  ascendingOrder: boolean = false
) => {
  try {
    const apiKey = process.env.HUME_API_KEY || "";
    const response = await axios.get("https://api.hume.ai/v0/evi/chat_groups", {
      headers: {
        "X-Hume-Api-Key": apiKey,
      },
      params: {
        page_number: pageNumber,
        page_size: pageSize,
        ascending_order: ascendingOrder,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error retrieving chat groups:", error);
    throw new HttpError(500, "Failed to retrieve chat groups");
  }
};

export const getChats = async (
  pageNumber: number = 0,
  pageSize: number = 10,
  ascendingOrder: boolean = false
) => {
  try {
    const apiKey = process.env.HUME_API_KEY || "";
    const response = await axios.get("https://api.hume.ai/v0/evi/chats", {
      headers: {
        "X-Hume-Api-Key": apiKey,
      },
      params: {
        page_number: pageNumber,
        page_size: pageSize,
        ascending_order: ascendingOrder,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error retrieving chats:", error);
    throw new HttpError(500, "Failed to retrieve chats");
  }
};

export const getChatEvents = async (
  chatGroupId: string,
  pageNumber: number = 0,
  pageSize: number = 100,
  ascendingOrder: boolean = true
) => {
  try {
    const apiKey = process.env.HUME_API_KEY || "";
    const response = await axios.get(
      `https://api.hume.ai/v0/evi/chat_groups/${chatGroupId}/events`,
      {
        headers: {
          "X-Hume-Api-Key": apiKey,
        },
        params: {
          page_number: pageNumber,
          page_size: pageSize,
          ascending_order: ascendingOrder,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      `Error retrieving chat events for chat group ${chatGroupId}:`,
      error
    );
    throw new HttpError(500, "Failed to retrieve chat events");
  }
};

