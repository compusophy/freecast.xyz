import type { NextApiRequest, NextApiResponse } from 'next';
import {
  ParseWebhookEvent,
  parseWebhookEvent,
  verifyAppKeyWithNeynar,
} from "@farcaster/frame-node";
import {
  deleteUserNotificationDetails,
  setUserNotificationDetails,
} from "../../lib/kv";
import { sendFrameNotification } from "../../lib/notifs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  console.log('Raw webhook request:', {
    body: req.body,
    headers: req.headers,
    url: req.url
  });

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

  // Extract subdomain from the frame URL in the webhook data
  const frameUrl = data.event.frameActionBody?.url || '';
  console.log('Frame URL:', frameUrl);
  
  let subdomain = '';
  if (frameUrl) {
    const urlParts = new URL(frameUrl).hostname.split('.');
    if (urlParts.length > 2) {
      subdomain = urlParts[0];
    }
  }

  console.log('Webhook details:', {
    frameUrl,
    extractedSubdomain: subdomain,
    host: req.headers.host,
  });

  const fid = data.fid;
  const event = data.event;

  switch (event.event) {
    case "frame_added":
      if (event.notificationDetails) {
        await setUserNotificationDetails(fid, event.notificationDetails, subdomain);
        await sendFrameNotification({
          fid,
          title: subdomain ? `Welcome to ${subdomain}` : "Welcome to Freecast",
          body: "Frame is now added to your client",
          subdomain: subdomain || '',
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
        subdomain: subdomain || '',
      });
      break;

    case "notifications_disabled":
      await deleteUserNotificationDetails(fid);
      break;
  }

  return res.json({ success: true });
} 