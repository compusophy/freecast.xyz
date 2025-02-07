import { ImageResponse } from "next/og";

export const runtime = 'edge';

export async function GET(request: Request) {
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
          position: 'relative',
        }}
      >
        {/* Top left domain indicator - only show when subdomain is not empty */}
        {subdomain !== '' && (
          <div
            style={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              color: 'rgba(255, 255, 255, 0.5)',
              fontSize: '16px',
            }}
          >
            [*.freecast.xyz]
          </div>
        )}

        {/* Center text */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <h1 
            style={{ 
              fontSize: '48px', 
              color: 'white',
              margin: '0',
              lineHeight: '1',
            }}
          >
            {subdomain || '[*.freecast.xyz]'}
          </h1>
        </div>
      </div>
    ),
    {
      width: 600,
      height: 400,
    }
  );
} 