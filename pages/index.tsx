import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import sdk from "@farcaster/frame-sdk";
import type { Metadata } from 'next';
import { GetServerSideProps } from 'next';
import Head from 'next/head';

import Spinner from "../components/spinner";
import { getDefaultMarkup, getPageData } from "../lib/data";
import { EditorLayout } from "../views/editor";
import { FixedCenterLayout } from "../views/fixed-center";
import { RenderStaticLayout } from "../views/static-layout";
import { Welcome } from "../views/welcome";

export const revalidate = 300;

export const getServerSideProps: GetServerSideProps = async (context) => {
  // Get subdomain from host
  const host = context.req.headers.host || '';
  const parts = host.split('.');
  const subdomainFromHost = parts.length > (host.includes('localhost') ? 1 : 2) ? parts[0] : '';

  // Get subdomain from path
  const path = context.req.url?.split('/')[1] || '';
  
  // Use either the subdomain from host or from path
  const subdomain = subdomainFromHost || path;

  // If accessing via path and not on the subdomain, redirect to subdomain
  if (path && !subdomainFromHost && !host.includes('localhost')) {
    return {
      redirect: {
        destination: `https://${path}.freecast.xyz`,
        permanent: true,
      },
    };
  }

  return {
    props: {
      initialSubdomain: subdomain || '',
    },
  };
};

export async function generateMetadata({ params }: { params: { initialSubdomain: string } }): Promise<Metadata> {
  const subdomain = params.initialSubdomain;
  
  const frameData = {
    version: "next",
    imageUrl: `https://freecast.xyz/opengraph-image${subdomain ? `?subdomain=${subdomain}` : ''}`,
    button: {
      title: "launch",
      action: {
        type: "launch_frame",
        name: subdomain || "freecast.xyz",
        url: `https://freecast.xyz/${subdomain || ''}`,
        splashImageUrl: `https://freecast.xyz/splash.png`,
        splashBackgroundColor: "#000000",
      },
    },
  };

  return {
    title: subdomain ? `${subdomain}.freecast.xyz` : 'freecast.xyz',
    openGraph: {
      title: subdomain ? `${subdomain}.freecast.xyz` : 'freecast.xyz',
      description: subdomain ? `${subdomain}'s freecast frame` : 'freecast frame',
      images: [`https://freecast.xyz/opengraph-image${subdomain ? `?subdomain=${subdomain}` : ''}`],
    },
    other: {
      "fc:frame": JSON.stringify(frameData),
    },
  };
}

export default function IndexPage({ initialSubdomain }: { initialSubdomain: string }) {
  const [pageData, setPageData] = useState<any>();
  const [error, setError] = useState<any>();
  const [subdomain, setSubdomain] = useState(initialSubdomain);
  const [frameContext, setFrameContext] = useState<any>();
  const router = useRouter();

  useEffect(() => {
    const initializeSDK = async () => {
      try {
        const context = await sdk.context;
        setFrameContext(context);
        sdk.actions.ready();
      } catch (e) {
        console.log('Not in a Frame context');
      }
    };

    initializeSDK();
  }, []);

  useEffect(() => {
    // Handle share button clicks
    const handleMessage = async (event: MessageEvent) => {
      if (event.data.type === 'shareToWarpcast') {
        console.log('Frame context:', frameContext); // Debug log
        console.log('Fallback URL:', event.data.fallbackUrl); // Debug log
        
        if (frameContext) {
          // In Frame context, use SDK
          const shareText = encodeURIComponent(`check out this frame ${event.data.page}.freecast.xyz`);
          const shareUrl = encodeURIComponent(`https://${event.data.page}.freecast.xyz`);
          const warpcastUrl = `https://warpcast.com/~/compose?text=${shareText}&embeds[]=${shareUrl}`;
          await sdk.actions.openUrl(warpcastUrl);
        } else {
          // Not in Frame context, redirect to fallback URL
          window.open(event.data.fallbackUrl, '_blank', 'noopener,noreferrer');
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [frameContext]);

  const savePage = async (html: string) => {
    try {
      const response = await fetch('/api/save-page', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ html })
      });
      
      if (!response.ok) {
        throw new Error('Failed to save page');
      }
      
      setPageData(prev => ({
        ...prev,
        html
      }));
      
      return true;
    } catch (error) {
      console.error('Save error:', error);
      return false;
    }
  };

  useEffect(() => {
    let href = window.location.href;
    let linkToken = router.query.edit;

    if (linkToken) {
      document.cookie = `linkToken=${linkToken}`;
      window.location.href = "/";
    }

    if (!pageData) {
      getPageData(href)
        .then(data => {
          if (!data) {
            setPageData(null);
            return;
          }
          if (data.errorCode) {
            let { errorCode, stack, message } = data;
            setError({ errorCode, stack, message });
            return;
          }
          let { html, allowEdit, editLink } = data;
          setPageData({ html, allowEdit, editLink });
          return;
        })
        .catch(e => {
          setError({ message: e.message, stack: e.stack });
        });
    }
  }, [pageData, router.query.edit]);

  const metadata = (
    <Head>
      <title>{subdomain ? `${subdomain}.freecast.xyz` : 'freecast.xyz'}</title>
      <meta property="og:title" content={subdomain ? `${subdomain}.freecast.xyz` : 'freecast.xyz'} />
      <meta
        property="og:description"
        content={subdomain ? `${subdomain}'s freecast frame` : 'freecast frame'}
      />
      <meta property="og:image" content={subdomain ? 
        `https://freecast.xyz/opengraph-image?subdomain=${subdomain}` : 
        'https://freecast.xyz/opengraph-image-home.png'
      } />
      <meta 
        property="fc:frame" 
        content={JSON.stringify({
          version: "next",
          imageUrl: subdomain ? 
            `https://freecast.xyz/opengraph-image?subdomain=${subdomain}` : 
            'https://freecast.xyz/opengraph-image-home.png',
          button: {
            title: "launch",
            action: {
              type: "launch_frame",
              name: subdomain || "freecast.xyz",
              url: `https://freecast.xyz/${subdomain || ''}`,
              splashImageUrl: `https://freecast.xyz/splash.png`,
              splashBackgroundColor: "#000000",
            },
          },
        })} 
      />
    </Head>
  );

  if (error) {
    return (
      <FixedCenterLayout>
        {metadata}
        <div>
          {error.errorCode && <h1>HTTP Status: {error.errorCode}</h1>}
          <h2>{error.message}</h2>
          <img src="https://media.giphy.com/media/953Nn3kYUbGxO/giphy.gif" alt="Error gif" />
          {error.stack && (
            <div>
              <code>{JSON.stringify(error.stack)}</code>
            </div>
          )}
          <style jsx>{`
            div {
              text-align: center;
            }
            code {
              color: red;
            }
            img {
              max-width: 100%;
            }
          `}</style>
        </div>
      </FixedCenterLayout>
    );
  }

  if (typeof pageData === "undefined") {
    return (
      <FixedCenterLayout>
        {metadata}
        <Spinner delay={300} />
      </FixedCenterLayout>
    );
  }

  if (pageData && pageData.html === null) {
    const defaultPage = getDefaultMarkup('welcome');
    return (
      <>
        {metadata}
        <EditorLayout html={defaultPage} onSave={savePage} />
      </>
    );
  }

  if (pageData && pageData.html && pageData.allowEdit) {
    return (
      <>
        {metadata}
        <EditorLayout html={pageData.html} onSave={savePage} />
      </>
    );
  }

  if (pageData && pageData.html && !pageData.allowEdit) {
    return (
      <>
        {metadata}
        <RenderStaticLayout html={pageData.html} />
      </>
    );
  }

  return (
    <>
      {metadata}
      <Welcome />
    </>
  );
}
