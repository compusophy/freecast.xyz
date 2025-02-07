import { ImageResponse } from "next/og";

export const runtime = 'edge';

export async function GET(request: Request) {
  // Get subdomain from query parameter
  const { searchParams } = new URL(request.url);
  const subdomain = searchParams.get('subdomain') || '';

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#000000',
          fontFamily: 'monospace',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <h1 
            style={{ 
              fontSize: '60px', 
              color: 'white',
              margin: '0',
              lineHeight: '1.2',
            }}
          >
            {subdomain ? `[${subdomain}.*]` : 'freecast'}
          </h1>
          <p
            style={{
              fontSize: '24px',
              color: 'rgba(255, 255, 255, 0.7)',
              marginTop: '20px',
            }}
          >
            {subdomain ? `${subdomain}'s freecast page` : 'claim any subdomain and have fun!'}
          </p>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
} 