import { Client, fql } from 'fauna';
import type { NextApiRequest, NextApiResponse } from 'next';

const client = new Client({
  secret: process.env.FAUNADB_STATIC_FUN_KEY
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Get page name from subdomain
  const isDev = req.headers.host?.includes("localhost");
  const splitHost = req.headers.host?.split(".") || [];
  const page = isDev ? splitHost[0] : splitHost[0];

  console.log('Host:', req.headers.host);
  console.log('Page name:', page);

  if (!page) {
    res.status(400).json({ message: "No page specified" });
    return;
  }

  try {
    const result = await client.query(fql`
      pages.firstWhere(.name == ${page})
    `) as any;

    console.log('Query result:', result);

    // The HTML is in result.data.html
    res.status(200).json({ 
      html: result?.data?.html || null,
      allowEdit: true
    });
  } catch (error) {
    console.error('Error details:', error);
    res.status(500).json({ message: "Error getting page" });
  }
}