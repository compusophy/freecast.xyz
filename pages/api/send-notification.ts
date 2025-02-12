import { type FrameNotificationDetails } from "@farcaster/frame-sdk";
import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from "zod";
import { setUserNotificationDetails } from "../../lib/kv";
import { sendFrameNotification } from "../../lib/notifs";

// Define a simpler schema without recursion
const notificationDetailsSchema = z.object({
  token: z.string(),
  url: z.string(),
}) satisfies z.ZodType<FrameNotificationDetails>;

const requestSchema = z.object({
  fid: z.number(),
  notificationDetails: notificationDetailsSchema,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get page name from subdomain
  const isDev = req.headers.host?.includes("localhost");
  const splitHost = req.headers.host?.split(".") || [];
  const subdomain = isDev ? splitHost[0] : splitHost[0];

  if (!subdomain) {
    return res.status(400).json({
      success: false,
      error: "No subdomain specified"
    });
  }

  const requestBody = requestSchema.safeParse(req.body);

  if (requestBody.success === false) {
    return res.status(400).json({
      success: false,
      errors: requestBody.error.errors
    });
  }

  await setUserNotificationDetails(
    requestBody.data.fid,
    requestBody.data.notificationDetails
  );

  const sendResult = await sendFrameNotification({
    fid: requestBody.data.fid,
    title: "Test notification",
    body: "Sent at " + new Date().toISOString(),
    subdomain,
  });

  if (sendResult.state === "error") {
    return res.status(500).json({
      success: false,
      error: sendResult.error
    });
  } else if (sendResult.state === "rate_limit") {
    return res.status(429).json({
      success: false,
      error: "Rate limited"
    });
  }

  return res.json({ success: true });
} 