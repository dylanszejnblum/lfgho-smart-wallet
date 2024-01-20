import {
  PimlicoPaymasterV1Client,
  createPimlicoPaymasterV1Client,
} from "@/utils/PimlicoPaymasterV1Client";
import {
  PimlicoBundlerClient,
  createPimlicoBundlerClient,
} from "permissionless/clients/pimlico";
import React, { createContext, useContext, useState, ReactNode } from "react";
import { Chain, PublicClient, Transport } from "viem";

// Context Type
type ApplicationContextType = {
  ethereumClient: PublicClient<Transport, Chain> | undefined;
  bundlerClient: PimlicoBundlerClient | undefined;
  paymasterClient: PimlicoPaymasterV1Client | undefined;
  accountAddress: `0x${string}` | undefined;
  accountFactoryAddress: `0x${string}` | undefined;
  entryPointAddress: `0x${string}` | undefined;
  chain: `0x${string}` | undefined;
  createPasskeyAccount: () => Promise<void>;
  backUpAccount: () => Promise<void>;
  sendUserOperation: () => Promise<void>;
};

// Context
export const ApplicationContext = createContext<ApplicationContextType>({
  ethereumClient: undefined,
  bundlerClient: undefined,
  paymasterClient: undefined,
  accountAddress: undefined,
  accountFactoryAddress: undefined,
  entryPointAddress: undefined,
  chain: undefined,
  createPasskeyAccount: async () => {},
  backUpAccount: async () => {},
  sendUserOperation: async () => {},
});

// Provider Props Type
interface ApplicationContextProps {
  children: ReactNode;
}

// Provider
export const ApplicationProvider: React.FC<ApplicationContextProps> = ({
  children,
}) => {
  const [ethereumClient, setEthereumClient] =
    useState<PublicClient<Transport, Chain>>();
  const [bundlerClient, setBundlerClient] = useState<PimlicoBundlerClient>();
  const [paymasterClient, setPaymasterClient] =
    useState<PimlicoPaymasterV1Client>();
  const [accountAddress, setAccountAddress] = useState<`0x${string}`>();
  const accountFactoryAddress = "0x91161e6d7E9B6eCDb488467A5bd8A526C5f75A33";
  const entryPointAddress = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789";
  const chain = "0xaa36a7";

  const createPasskeyAccount = async () => {};
  const backUpAccount = async () => {};
  const sendUserOperation = async () => {};

  return (
    <ApplicationContext.Provider
      value={{
        ethereumClient,
        bundlerClient,
        paymasterClient,
        accountAddress,
        accountFactoryAddress,
        entryPointAddress,
        chain,
        createPasskeyAccount,
        backUpAccount,
        sendUserOperation,
      }}
    >
      {children}
    </ApplicationContext.Provider>
  );
};

// Hook
export const useApplicationContext = () => useContext(ApplicationContext);
