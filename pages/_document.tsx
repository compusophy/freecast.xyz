/* eslint-disable sort-keys-fix/sort-keys-fix */
/* eslint-disable react/jsx-sort-props */
/* eslint-disable react/function-component-definition */
import {
  Html,
  Head,
  Main,
  NextScript,
  type DocumentProps,
} from "next/document";
import { type ReactElement } from "react";

export default function Document(_props: DocumentProps): ReactElement {
  const defaultFrame = {
    version: "next",
    imageUrl: "https://freecast.xyz/opengraph-image.png",
    button: {
      title: "launch",
      action: {
        type: "launch_frame",
        name: "freecast",
        url: "https://freecast.xyz",
        splashImageUrl: "https://freecast.xyz/splash.png",
        splashBackgroundColor: "#000000",
      },
    },
  };

  return (
    <Html lang="en" style={{ background: "#000000" }}>
      <Head>
        <meta property="og:title" content="freecast" />
        <meta
          property="og:description"
          content="claim any subdomain and have fun!"
        />
        <meta property="og:image" content="https://freecast.xyz/image.png" />
        <meta property="fc:frame" content={JSON.stringify(defaultFrame)} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
