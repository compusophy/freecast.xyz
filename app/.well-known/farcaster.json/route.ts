export async function GET(request: Request) {
  // Get the host from the request headers
  const host = request.headers.get('host') || 'freecast.xyz';
  
  // Strip any existing subdomain for the base domain
  const baseDomain = host.split('.').slice(-2).join('.');
  
  // Extract subdomain
  const parts = host.split('.');
  const subdomain = parts.length > (host.includes('localhost') ? 1 : 2) ? parts[0] : '';
  
  // Use https protocol for production, http for localhost
  const protocol = host.includes('localhost') ? 'http' : 'https';
  
  // For homeUrl, use the path-based URL
  const baseUrl = `${protocol}://${baseDomain}`;
  const pathBasedUrl = subdomain ? `${baseUrl}/${subdomain}` : baseUrl;

  const config = {
    // Use special account association for test subdomain
    ...(subdomain === 'test' && {
      accountAssociation: {
        header: "",
        payload: "",
        signature: ""
      }
    }),
    // Default account association for other subdomains
    ...(subdomain !== 'test' && {
      accountAssociation: {
        header: "",
        payload: "",
        signature: ""
      }
    }),

    frame: {
      version: "1",
      name: "freecast",
      iconUrl: `${baseUrl}/icon.png`,
      homeUrl: pathBasedUrl,
      imageUrl: `${baseUrl}/opengraph-image.png`,
      buttonTitle: "launch",
      splashImageUrl: `${baseUrl}/splash.png`,
      splashBackgroundColor: "#f7f7f7",
      webhookUrl: `${baseUrl}/api/webhook`,
      url: pathBasedUrl,
    },
  };

  return Response.json(config);
}