import type { AppProps } from 'next/app';
import WagmiProvider from '../components/providers/WagmiProvider';
import BaseLayout from '../components/layouts/BaseLayout';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiProvider>
      <BaseLayout>
        <Component {...pageProps} />
      </BaseLayout>
      <style jsx global>{`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        /* Webkit browsers (Chrome, Safari) */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
          background: #0a0a0f;
        }

        ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
        }

        ::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 4px;
          transition: all 0.3s ease;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        /* Firefox */
        * {
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 255, 255, 0.2) rgba(255, 255, 255, 0.05);
        }

        body {
          background: #0a0a0f;
          color: rgba(255, 255, 255, 0.9);
          font-family: "JetBrains Mono", "Courier New", monospace;
        }
      `}</style>
    </WagmiProvider>
  );
}