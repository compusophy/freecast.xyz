import { Client, fql } from 'fauna';
import { ethers } from 'ethers';
import { FarcasterJFS } from '../../../lib/farcaster-jfs';
import { ref, get, set } from "firebase/database";
import { db } from '../../../lib/firebase';

const faunaClient = new Client({
  secret: process.env.FAUNADB_STATIC_FUN_KEY!
});

// Constants for Farcaster verification
const CUSTODY_PRIVATE_KEY = process.env.CUSTODY_PRIVATE_KEY!;
const FID = 527379;

// Hardcoded account association for base domain
// const BASE_DOMAIN_ASSOCIATION = {
//   header: "eyJmaWQiOjUyNzM3OSwidHlwZSI6ImN1c3RvZHkiLCJrZXkiOiIweDdGODE1NjRhRkQ4OURjOTk0Y0UwOUJFNERhMDVmQjkyMTlDRjNCMjAifQ",
//   payload: "eyJkb21haW4iOiJmcmVlY2FzdC54eXoifQ",
//   signature: "MHg4MTBiZjYxNGEwYjMzZjI0MDM1M2E3Y2FmYmI1ZjA0MmEzZjE1NjhlZGFmZDg3Y2Q5YjgxNDYwYWMzNmEwOTYxMTJkMDUyMTgyNDViZWNhZDVmODYzYWEwYzE1ZTdjYzRmY2M2Y2RlOTQzZTU2NGM1MjcxMzQyZWNlM2MzYTJhZTFj"
// };

const BASE_DOMAIN_ASSOCIATION = {
  header: "",
  payload: "",
  signature: ""
};

type AccountAssociation = {
  header: string;
  payload: string;
  signature: string;
};

function getSignatureKey(subdomain: string): string {
  return `signatures/${subdomain}`;
}

export async function GET(request: Request) {
  const host = request.headers.get('host') || 'freecast.xyz';
  const baseDomain = host.split('.').slice(-2).join('.');
  const parts = host.split('.');
  const subdomain = parts.length > (host.includes('localhost') ? 1 : 2) ? parts[0] : '';
  const protocol = host.includes('localhost') ? 'http' : 'https';
  const baseUrl = `${protocol}://${baseDomain}`;

  let accountAssociation: AccountAssociation | null = null;

  try {
    if (subdomain) {
      // Check Firebase for existing signature
      const signatureRef = ref(db, getSignatureKey(subdomain));
      const snapshot = await get(signatureRef);

      if (snapshot.exists()) {
        accountAssociation = snapshot.val() as AccountAssociation;
      } else {
        // Generate and store new signature
        const signer = new ethers.Wallet(CUSTODY_PRIVATE_KEY);
        const newSignature = await FarcasterJFS.sign(
          FID,
          await signer.getAddress(),
          { domain: `${subdomain}.${baseDomain}` },
          signer
        );
        
        await set(signatureRef, newSignature);
        accountAssociation = newSignature;
      }
    } else {
      accountAssociation = BASE_DOMAIN_ASSOCIATION;
    }
  } catch (err) {
    console.error("Error with signature:", err);
  }

  const config = {
    ...(accountAssociation
      ? { accountAssociation }
      : {
          accountAssociation: {
            header: "",
            payload: "",
            signature: ""
          }
        }
    ),

    frame: {
      version: "1",
      name: subdomain ? `${subdomain}.freecast.xyz` : "freecast.xyz",
      iconUrl: subdomain 
        ? `${protocol}://${subdomain}.${baseDomain}/icon.png`
        : `${baseUrl}/icon.png`,
      homeUrl: subdomain
        ? `${protocol}://${subdomain}.${baseDomain}`
        : baseUrl,
      imageUrl: subdomain
        ? `${protocol}://${subdomain}.${baseDomain}/opengraph-image.png`
        : `${baseUrl}/opengraph-image.png`,
      buttonTitle: "launch",
      splashImageUrl: subdomain
        ? `${protocol}://${subdomain}.${baseDomain}/splash.png`
        : `${baseUrl}/splash.png`,
      splashBackgroundColor: "#000000",
      webhookUrl: subdomain 
        ? `${protocol}://${subdomain}.${baseDomain}/api/webhook`
        : `${baseUrl}/api/webhook`,
      url: subdomain
        ? `${protocol}://${subdomain}.${baseDomain}`
        : baseUrl
    }
  };

  console.log('Serving frame config:', {
    host,
    subdomain,
    webhookUrl: config.frame.webhookUrl,
    homeUrl: config.frame.homeUrl,
    url: config.frame.url
  });

  return Response.json(config);
}