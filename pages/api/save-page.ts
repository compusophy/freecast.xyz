import { Client, fql } from 'fauna';
import type { NextApiRequest, NextApiResponse } from 'next';
import Pusher from "pusher";

const client = new Client({
  secret: process.env.FAUNADB_STATIC_FUN_KEY
});

// Add type assertions to ensure these are strings
const appId = process.env.NEXT_PUBLIC_PUSHER_APP_ID as string;
const key = process.env.NEXT_PUBLIC_PUSHER_KEY as string;
const secret = process.env.NEXT_PUBLIC_PUSHER_SECRET as string;
const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER as string;

const pusher = new Pusher({
  appId,
  key,
  secret,
  cluster
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Get page name from subdomain
  const isDev = req.headers.host?.includes("localhost");
  const splitHost = req.headers.host?.split(".") || [];
  const page = isDev ? splitHost[0] : splitHost[0];
  const { html } = req.body;

  // Validate required fields
  if (!page) {
    res.status(400).json({ message: "No page specified" });
    return;
  }

  if (html === undefined) {
    res.status(400).json({ message: "No HTML content provided" });
    return;
  }

  try {
    // Simple upsert - create or update the page
    await client.query(fql`
      let existingPage = pages.firstWhere(.name == ${page})
      if (existingPage == null) {
        pages.create({
          name: ${page},
          html: ${html || ""}  // Default to empty string if null/undefined
        })
      } else {
        existingPage!.update({ 
          html: ${html || ""}  // Default to empty string if null/undefined
        })
      }
    `);

    // Notify other clients of the update
    await pusher.trigger(page, "hydrate-html", html || "");

    res.status(200).json({ message: "Saved" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      message: "Error saving page",
      error: error instanceof Error ? error.message : String(error)
    });
  }
}
