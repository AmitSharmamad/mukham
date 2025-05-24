import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document';

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head>
          {/* PWA meta tags */}
          <meta name="application-name" content="Mukham - Algo Trading Platform" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="default" />
          <meta name="apple-mobile-web-app-title" content="Mukham" />
          <meta name="description" content="A robust algo trading platform for professional traders" />
          <meta name="format-detection" content="telephone=no" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="theme-color" content="#121212" />

          {/* PWA manifest and icons */}
          <link rel="manifest" href="/manifest.json" />
          <link rel="shortcut icon" href="/icons/icon-192x192.png" />
          <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
          
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function() {
                  try {
                    var mode = localStorage.getItem('theme') || 'dark';
                    document.documentElement.dataset.theme = mode;
                    document.documentElement.style.backgroundColor = mode === 'dark' ? '#121212' : '#ffffff';
                  } catch (e) {}
                })();
              `,
            }}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;