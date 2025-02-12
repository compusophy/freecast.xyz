import type { NextApiRequest, NextApiResponse } from 'next';
import {
  ParseWebhookEvent,
  parseWebhookEvent,
  verifyAppKeyWithNeynar,
} from "@farcaster/frame-node";
import {
  deleteUserNotificationDetails,
  setUserNotificationDetails,
} from "../../../lib/kv";
import { sendFrameNotification } from "../../../lib/notifs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get subdomain from path parameter
  const { subdomain } = req.query;
  
  if (!subdomain || typeof subdomain !== 'string') {
    return res.status(400).json({ 
      success: false, 
      error: "No subdomain specified" 
    });
  }

  let data;
  try {
    data = await parseWebhookEvent(req.body, verifyAppKeyWithNeynar);
  } catch (e: unknown) {
    const error = e as ParseWebhookEvent.ErrorType;

    switch (error.name) {
      case "VerifyJsonFarcasterSignature.InvalidDataError":
      case "VerifyJsonFarcasterSignature.InvalidEventDataError":
        return res.status(400).json({ 
          success: false, 
          error: error.message 
        });
      case "VerifyJsonFarcasterSignature.InvalidAppKeyError":
        return res.status(401).json({ 
          success: false, 
          error: error.message 
        });
      case "VerifyJsonFarcasterSignature.VerifyAppKeyError":
        return res.status(500).json({ 
          success: false, 
          error: error.message 
        });
    }
  }

  const fid = data.fid;
  const event = data.event;

  switch (event.event) {
    case "frame_added":
      if (event.notificationDetails) {
        await setUserNotificationDetails(fid, event.notificationDetails);
        await sendFrameNotification({
          fid,
          title: "Welcome to subFreecast",
          body: "Frame is now added to your client",
          subdomain,
        });
      } else {
        await deleteUserNotificationDetails(fid);
      }
      break;

    case "frame_removed":
      await deleteUserNotificationDetails(fid);
      break;

    case "notifications_enabled":
      await setUserNotificationDetails(fid, event.notificationDetails);
      await sendFrameNotification({
        fid,
        title: "Notifications Enabled",
        body: "You'll now receive updates from Freecast",
        subdomain,
      });
      break;

    case "notifications_disabled":
      await deleteUserNotificationDetails(fid);
      break;
  }

  return res.json({ success: true });
} 