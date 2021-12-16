import React from 'react';

import NextDocument, {
  Html, Head, Main, NextScript,
} from 'next/document';

class Document extends NextDocument {
  // eslint-disable-next-line class-methods-use-this
  render() {
    return (
      <Html>
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com"/>
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin/>
          <link href="https://fonts.googleapis.com/css2?family=Barlow+Semi+Condensed:ital,wght@0,600;1,600&display=swap" rel="stylesheet"/>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default Document;
