import { createConfig, http } from "wagmi";
import { base, optimism } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider as Wagmi } from "wagmi";

// Dynamically import the frame connector to avoid ESM issues
const getFrameConnector = async () => {
  const { farcasterFrame } = await import("@farcaster/frame-wagmi-connector");
  return farcasterFrame();
};

const config = createConfig({
  chains: [base, optimism],
  transports: {
    [base.id]: http(),
    [optimism.id]: http(),
  },
  connectors: []  // We'll add the connector dynamically
});

const queryClient = new QueryClient();

export default function Provider({ children }: { children: React.ReactNode }) {
  return (
    <Wagmi config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </Wagmi>
  );
}