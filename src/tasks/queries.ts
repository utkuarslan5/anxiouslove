import { type Task } from "wasp/entities";
import { HttpError } from "wasp/server";
import {
  type GetTasks,
  type GetPosthogConfig,
  type GetHumeConfig,
} from "wasp/server/operations";

export const getTasks = ((_args, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  console.log("Getting tasks for user:", context.user.id);

  return context.entities.Task.findMany({
    where: { user: { id: context.user.id } },
    orderBy: { id: "asc" },
  });
}) satisfies GetTasks<void, Task[]>;

export const getPosthogConfig = (() => {
  console.log("getPosthogConfig called");
  const config = {
    apiKey: process.env.PUBLIC_POSTHOG_KEY || "",
    apiHost: process.env.PUBLIC_POSTHOG_HOST || "https://eu.i.posthog.com",
  };
  return config;
}) satisfies GetPosthogConfig<void, { apiKey: string; apiHost: string }>;

export const getHumeConfig = (() => {
  console.log("getHumeConfig called");
  const config = {
    apiKey: process.env.HUME_API_KEY || "",
    configId: process.env.HUME_CONFIG_ID || "",
  };
  return config;
}) satisfies GetHumeConfig<void, { apiKey: string; configId: string }>;
