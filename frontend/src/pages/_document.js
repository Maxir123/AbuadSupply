// src/pages/_document.js
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        {/* Accessible skip link */}
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
