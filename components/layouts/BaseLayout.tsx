import Head from "next/head";
import { ReactNode } from "react";
import sdk from "@farcaster/frame-sdk";
import { useEffect } from "react";

interface BaseLayoutProps {
  children: ReactNode;
}

export default function BaseLayout({ children }: BaseLayoutProps) {
  useEffect(() => {
    sdk.actions.ready();
  }, []);

  return (
    <>
      <Head>
        <title>Freecast</title>
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
      </Head>
      <main>
        {children}
      </main>
      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        html {
          height: 100%;
          width: 100%;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            Helvetica, Arial, sans-serif, "Apple Color Emoji",
            "Segoe UI Emoji", "Segoe UI Symbol";
          height: 100%;
          max-width: 100vw;
          overflow: hidden;
        }
      `}</style>
    </>
  );
} 