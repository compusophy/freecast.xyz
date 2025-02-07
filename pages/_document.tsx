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
  return (
    <Html lang="en" style={{ background: "#000000" }}>
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
