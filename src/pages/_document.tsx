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
          {/* Add default theme color meta tag */}
          <meta name="theme-color" content="#121212" />
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