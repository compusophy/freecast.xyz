import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { parseWebhookEvent, verifyAppKeyWithNeynar } = await import("@farcaster/frame-node");
    await parseWebhookEvent(req.body, verifyAppKeyWithNeynar);
  } catch (e: unknown) {
    const error = e as any;

    switch (error.name) {
      case "VerifyJsonFarcasterSignature.InvalidDataError":
      case "VerifyJsonFarcasterSignature.InvalidEventDataError":
        return res.status(400).json({ success: false, error: error.message });
      case "VerifyJsonFarcasterSignature.InvalidAppKeyError":
        return res.status(401).json({ success: false, error: error.message });
      case "VerifyJsonFarcasterSignature.VerifyAppKeyError":
        return res.status(500).json({ success: false, error: error.message });
    }
  }

  return res.json({ success: true });
} 