export async function GET() {
  const appUrl = "https://freecast.xyz";

  const config = {
    accountAssociation: {
      header: "eyJmaWQiOjM1MDkxMSwidHlwZSI6ImN1c3RvZHkiLCJrZXkiOiIweDJGREVmM0Y0NzBlQ2QyQmM5YTk3NzU2OEM0M0FEMzg2MGMxNjExRDgifQ",
      payload: "eyJkb21haW4iOiJmcmVlY2FzdC54eXoifQ",
      signature: "MHhhMjkyMWM0MzQ2OWE0NzczODhjYjIyOTFiYmYxNGU4NWY0NjgwMmYzMTBhNDM2ZjdmMjc3YWZhMmUwZDQxNDU2N2JiNmM3NTgxMTVhOWNmY2ViNjM1N2Q4NzhhNTk2ZmFlZGYyZTQyYTQxOWVlNWYwY2U5YmNlZTIxZDFmM2EwZDFi"
    },

    frame: {
      version: "1",
      name: "freecast",
      iconUrl: `${appUrl}/icon.png`,
      homeUrl: appUrl,
      imageUrl: `${appUrl}/opengraph-image.png`,
      buttonTitle: "launch",
      splashImageUrl: `${appUrl}/splash.png`,
      splashBackgroundColor: "#f7f7f7",
      webhookUrl: `${appUrl}/api/webhook`,
    },
  };

  return Response.json(config);
}