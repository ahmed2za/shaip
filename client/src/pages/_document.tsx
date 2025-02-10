import React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';
import createEmotionServer from '@emotion/server/create-instance';
import createCache from '@emotion/cache';
import { prefixer } from 'stylis';
import rtlPlugin from 'stylis-plugin-rtl';

const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
});

const { extractCritical } = createEmotionServer(cacheRtl);

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="ar" dir="rtl">
        <Head>
          <link
            href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700&display=swap"
            rel="stylesheet"
          />
          <meta name="emotion-insertion-point" content="" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

// `getInitialProps` belongs to `_document` (instead of `_app`),
// it's compatible with static-site generation (SSG).
MyDocument.getInitialProps = async (ctx) => {
  const originalRenderPage = ctx.renderPage;

  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (App) =>
        function EnhanceApp(props) {
          return <App {...props} />;
        },
    });

  const initialProps = await Document.getInitialProps(ctx);
  const emotionStyles = extractCritical(initialProps.html);

  return {
    ...initialProps,
    styles: [
      ...React.Children.toArray(initialProps.styles),
      <style
        key="emotion-style-tag"
        data-emotion={`css ${emotionStyles.ids.join(' ')}`}
        dangerouslySetInnerHTML={{ __html: emotionStyles.css }}
      />,
    ],
  };
};
