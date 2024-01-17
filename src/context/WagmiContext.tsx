import { polygonMumbai } from "@wagmi/core/chains";
import { FC, ReactNode } from "react";
import { createPublicClient, http } from "viem";
import { configureChains, createConfig, WagmiConfig } from "wagmi";

import { alchemyProvider } from "wagmi/providers/alchemy";
import Web3AuthConnectorInstance from "@/context/connectors/Web3AuthConnector";

import { publicProvider } from "wagmi/providers/public";
const { chains, webSocketPublicClient } = configureChains(
  [polygonMumbai],
  [
    alchemyProvider({
      apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY as string,
    }),
    publicProvider(),
  ]
);

const config = createConfig({
  autoConnect: true,
  publicClient: createPublicClient({
    chain: polygonMumbai,
    transport: http(),
  }),
  connectors: [Web3AuthConnectorInstance(chains)],

  webSocketPublicClient,
});

interface WagmiProviderProps {
  children: ReactNode;
}

export const WagmiProvider: FC<WagmiProviderProps> = ({ children }) => {
  return <WagmiConfig config={config}>{children}</WagmiConfig>;
};
