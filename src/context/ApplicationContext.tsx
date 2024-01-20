import {
  PimlicoPaymasterV1Client,
  createPimlicoPaymasterV1Client,
} from "@/utils/PimlicoPaymasterV1Client";
import {
  PimlicoBundlerClient,
  createPimlicoBundlerClient,
} from "permissionless/clients/pimlico";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import {
  Chain,
  Hex,
  PublicClient,
  RpcRequestError,
  Transport,
  createPublicClient,
  encodeFunctionData,
  getAddress,
  hexToString,
  http,
  namehash,
  numberToBytes,
  pad,
  toHex,
} from "viem";
import { normalize } from "viem/ens";
import {
  Verification,
  create,
  get,
  getPublicKeyFromAttestationResponse,
  getPublicKeyXYCoordinate,
  hex2buf,
  importPublicKeyAsCryptoKey,
  parseBase64url,
  verifySignature,
} from "zero-trust-passkey";
import { useLocalStorage, useSessionStorage } from "usehooks-ts";
import {
  foreverSubdomainAvailableAbi,
  setAddressRecordPublicResolverAbi,
  setNameRecordPublicResolverAbi,
  setTextRecordPublicResolverAbi,
  zeroTrustDomainRegisterAbi,
} from "@/utils/contracts/SubDomain";
import {
  AccountValidator,
  PassKeySignatureError,
  ZeroTrustPasskeyValidator,
  ZeroTrustSmartAccount,
} from "zero-trust-core-sdk";
import { toast } from "sonner";
import { sepolia } from "viem/chains";
import {
  GetUserOperationReceiptReturnType,
  UserOperation,
  getAccountNonce,
} from "permissionless";
// Context Type
type ApplicationContextType = {
  ethereumClient: PublicClient<Transport, Chain> | undefined;
  bundlerClient: PimlicoBundlerClient | undefined;
  paymasterClient: PimlicoPaymasterV1Client | undefined;
  accountAddress: `0x${string}` | undefined;
  accountFactoryAddress: `0x${string}` | undefined;
  entryPointAddress: `0x${string}` | undefined;
  chain: `0x${string}` | undefined;
  handlePasskeyCreation: (
    { yubikeyOnly }: { yubikeyOnly?: boolean },
    passkeyName: string
  ) => Promise<void>;
  handleUsernameCreation: (
    username: string,
    passkeyName: string
  ) => Promise<void>;
  handleLogin: (
    loginWith: "passkey_name" | "username",
    nameOrUsername: string
  ) => Promise<boolean>;
  isUsernameAvailable: (username: string) => Promise<boolean>;
  createPasskeyAccount: () => Promise<void>;
  backUpAccount: () => Promise<void>;
  sendUserOperation: (userOpCalldata: `0x${string}`) => Promise<void>;
};

type PasskeyMetaInfo = {
  accountAddress?: `0x${string}`;
  credentialId?: string;
  credentialRawId?: string;
  publicKeyAsHex?: string;
};

type LoggedInUser = {
  nameOrUsername?: string;
  loginWith?: "passkey_name" | "username";
  passkeyMetaInfo?: PasskeyMetaInfo;
};

export type LocalPasskeyMetaInfoMap = {
  [name: string]: PasskeyMetaInfo;
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
  handlePasskeyCreation: async () => {},
  handleUsernameCreation: async () => {},
  handleLogin: async (
    loginWith: "passkey_name" | "username",
    nameOrUsername: string
  ) => {
    return false;
  },
  createPasskeyAccount: async () => {},
  backUpAccount: async () => {},
  isUsernameAvailable: async () => {
    return false;
  },
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
  const chain = "0xaa36a7";
  const [ethereumClient, setEthereumClient] =
    useState<PublicClient<Transport, Chain>>();
  const [bundlerClient, setBundlerClient] = useState<PimlicoBundlerClient>();
  const [paymasterClient, setPaymasterClient] =
    useState<PimlicoPaymasterV1Client>();

  const [accountAddress, setAccountAddress] = useState<`0x${string}`>();
  const accountFactoryAddress = "0x91161e6d7E9B6eCDb488467A5bd8A526C5f75A33";
  const entryPointAddress = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789";
  const foreverSubdomainRegistrar =
    "0x9B46528dFB626791E138dFb43E5224848E4469c6";
  const publicResolverAddress = "0x8FADE66B79cC9f707aB26799354482EB93a5B7dD";

  //Sub domain constants
  const subnameParent = "0trust.eth";
  const subnameParentNode = namehash(subnameParent);

  const [localPasskeyMetaInfoMap, setLocalPasskeyMetaInfoMap] =
    useLocalStorage<LocalPasskeyMetaInfoMap>("localPasskeyMetaInfoMap", {});

  const [loggedInUser, setLogedInUser] = useSessionStorage<LoggedInUser>(
    "LoggedInUser",
    {}
  );

  useEffect(() => {
    const setClientsData = async () => {
      const ethereumClient = createPublicClient({
        chain: sepolia,
        transport: http(),
      });
      const _chain = "sepolia";
      const apiKey = process.env.NEXT_PUBLIC_PIMLICO_API_KEY;
      const pimlicoPaymasterEndpoint = `https://api.pimlico.io/v1/${_chain}/rpc?apikey=${apiKey}`;
      const bundlerEndpoint = `https://api.pimlico.io/v1/${_chain}/rpc?apikey=${apiKey}`;

      const bundlerClient = createPimlicoBundlerClient({
        chain: sepolia,
        transport: http(bundlerEndpoint),
      });

      const pimlicoPaymasterClient = createPimlicoPaymasterV1Client({
        chain: sepolia,
        transport: http(pimlicoPaymasterEndpoint),
      });

      setEthereumClient(ethereumClient);
      setBundlerClient(bundlerClient);
      setPaymasterClient(pimlicoPaymasterClient);
    };

    setClientsData();
  }, []);

  const handlePasskeyCreation = async (
    {
      yubikeyOnly,
    }: {
      yubikeyOnly?: boolean;
    },
    passkeyName: string
  ) => {
    const {
      data: credential,
      response,
      error,
    } = await create({
      appName: "SimonWallet",
      name: passkeyName,
      displayName: passkeyName,
      yubikeyOnly,
    });

    if (error) {
      throw new Error(error);
    }

    const passkeyInfo: PasskeyMetaInfo = {};

    if (credential && response) {
      const rawIdAsBase64 = btoa(
        String.fromCharCode.apply(null, new Uint8Array(credential.rawId))
      );

      const { data: publicKeyAsHex } = getPublicKeyFromAttestationResponse({
        response,
      } as { response: AuthenticatorAttestationResponse });
      const publicKeyAsCryptoKey = await importPublicKeyAsCryptoKey(
        hex2buf(publicKeyAsHex)
      );

      const [pubKeyX, pubKeyY] = await getPublicKeyXYCoordinate(
        publicKeyAsCryptoKey
      );
      const passkeySigner = new ZeroTrustPasskeyValidator(
        BigInt(pubKeyX),
        BigInt(pubKeyY),
        credential.id
      );

      const ztAccount = new ZeroTrustSmartAccount(ethereumClient, {
        signer: passkeySigner,
        accountFactoryAddress: accountFactoryAddress,
        entryPointAddress: entryPointAddress,
        index: BigInt(0),
      });

      passkeyInfo.credentialId = credential.id;
      passkeyInfo.credentialRawId = rawIdAsBase64;
      passkeyInfo.publicKeyAsHex = publicKeyAsHex;
      passkeyInfo.accountAddress = await ztAccount.getAddress();

      // Save the information in the local storage {passkeyName => PasskeyMetaInfo} Map
      setLocalPasskeyMetaInfoMap((prevMap) => ({
        ...prevMap,
        [passkeyName]: passkeyInfo,
      }));
      setAccountAddress(passkeyInfo.accountAddress);
    }
  };

  /**
   * This method check whether the username(subdomain ens) is available for registration
   * @param username
   * @returns
   */
  const isUsernameAvailable = async (username: string): Promise<boolean> => {
    const isAvailable = await ethereumClient.readContract({
      address: foreverSubdomainRegistrar,
      abi: foreverSubdomainAvailableAbi,
      functionName: "available",
      args: [namehash(`${username}.0trust.eth`)],
    });
    return isAvailable;
  };

  /**
   * This method register's a subdomain in the ENS regsitry for the account with given passkey
   * @param username subdomain ens to be registered
   * @param passkeyName passkey name to get the account for which subdomain is to be created
   * @returns
   */
  const handleUsernameCreation = async (
    username: string,
    passkeyName: string
  ) => {
    if (!localPasskeyMetaInfoMap[passkeyName]) {
      throw new Error(`Passkey ${passkeyName} related metadata not found`);
    }
    const isAvailable = await isUsernameAvailable(username);
    if (!isAvailable) {
      throw new Error(`Username ${username} not available to be registered`);
    }
    try {
      const publicKeyAsHex =
        localPasskeyMetaInfoMap[passkeyName].publicKeyAsHex;
      const publicKeyAsCryptoKey = await importPublicKeyAsCryptoKey(
        hex2buf(publicKeyAsHex)
      );
      const [pubKeyX, pubKeyY] = await getPublicKeyXYCoordinate(
        publicKeyAsCryptoKey
      );
      const credentialId = localPasskeyMetaInfoMap[passkeyName].credentialId;

      const passkeySigner = new ZeroTrustPasskeyValidator(
        BigInt(pubKeyX),
        BigInt(pubKeyY),
        credentialId
      );

      const ztAccount = new ZeroTrustSmartAccount(ethereumClient, {
        signer: passkeySigner,
        accountFactoryAddress: accountFactoryAddress,
        entryPointAddress: entryPointAddress,
        index: BigInt(0),
      });

      console.log(`Account Address: ${await ztAccount.getAddress()}`);

      // Getting already saved account address, can use this to just assert that ztAccount.getAddress
      // is same as saved one.
      const accountAddress = getAddress(
        localPasskeyMetaInfoMap[passkeyName].accountAddress
      );
      console.assert(
        accountAddress === (await ztAccount.getAddress()),
        "AccountAddress should be same as saved one."
      );

      // create userOperation to register a ens subdomain of zerotrust.eth

      const subname = `${username}.${subnameParent}`;
      const subnameNode = namehash(subname);

      console.log(`namehash of ${subname} : ${subnameNode}`);
      console.log(`namehash of ${subnameParent} : ${subnameParentNode}`);

      // ENS Address record for resolving username to Account Address
      const setAddressRecordCalldata = encodeFunctionData({
        abi: setAddressRecordPublicResolverAbi,
        functionName: "setAddr",
        args: [subnameNode, accountAddress],
      }) as Hex;

      // ENS name record for resolving address to a username
      const setNameRecordCalldata = encodeFunctionData({
        abi: setNameRecordPublicResolverAbi,
        functionName: "setName",
        args: [subnameNode, subname],
      }) as Hex;

      // ENS text record to store account initcode parameters [passkeyMeta data]
      const textRecordKey = "zeroTrustMetaData";
      const lengthOfPublicKeyAsHex = publicKeyAsHex.length;
      const textRecordValue = `${accountFactoryAddress}${toHex(
        pad(numberToBytes(0))
      ).substring(2)}${toHex(
        pad(numberToBytes(lengthOfPublicKeyAsHex))
      ).substring(2)}${publicKeyAsHex}${toHex(credentialId).substring(2)}`;
      console.log(textRecordKey, textRecordValue);
      const setTextRecordCalldata = encodeFunctionData({
        abi: setTextRecordPublicResolverAbi,
        functionName: "setText",
        args: [subnameNode, textRecordKey, textRecordValue],
      }) as Hex;

      // Creating register a subname calldata
      const registerCalldata = encodeFunctionData({
        abi: zeroTrustDomainRegisterAbi,
        functionName: "register",
        args: [
          subnameParentNode,
          username,
          accountAddress,
          publicResolverAddress,
          0,
          [
            setAddressRecordCalldata,
            setNameRecordCalldata,
            setTextRecordCalldata,
          ],
        ],
      }) as Hex;

      // Calldata to be called via account
      const userOpCalldata = await ztAccount.encodeExecuteCallData({
        to: foreverSubdomainRegistrar,
        value: BigInt(0),
        data: registerCalldata,
      });

      // Getting nonce value for the account
      const nonce = await getAccountNonce(ethereumClient, {
        sender: accountAddress,
        entryPoint: entryPointAddress,
      });

      // Preparing the partial user operation
      const userOperation: UserOperation = {
        callData: userOpCalldata ?? "0x",
        initCode: nonce === BigInt(0) ? await ztAccount.getInitCode() : "0x",
        sender: accountAddress,
        nonce: nonce,
        maxFeePerGas: BigInt(2000000),
        maxPriorityFeePerGas: BigInt(2000000),
        callGasLimit: BigInt(2000000),
        preVerificationGas: BigInt(2000000),
        verificationGasLimit: BigInt(2000000),
        paymasterAndData: "0x",
        signature:
          "0x00000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000170000000000000000000000000000000000000000000000000000000000000001417ad42d8551e4909ae47832ecb19f3f1dcc6d401de925a1dac9795354aef06b1a04cfe1fe086536a0c5da9034788be826d0a32856881de89ef0be4a3b75deec000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e00000000000000000000000000000000000000000000000000000000000000140000000000000000000000000000000000000000000000000000000000000002549960de5880e8c687434170f6476605b8fe4aeb9a28632c7995cf3ba831d9763050000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000867b2274797065223a22776562617574686e2e676574222c226368616c6c656e6765223a225f4b446e774676464534766a666f3154546561306d676a7662546c50397a2d2d71696977566567326f3977222c226f726967696e223a22687474703a2f2f6c6f63616c686f73743a35313733222c2263726f73734f726967696e223a66616c73657d0000000000000000000000000000000000000000000000000000",
      };

      console.log(userOperation);

      const gasPrices = await bundlerClient.getUserOperationGasPrice();
      console.log(`Gas Price: ${gasPrices}`);

      userOperation.maxFeePerGas = gasPrices.standard.maxFeePerGas;
      userOperation.maxPriorityFeePerGas =
        gasPrices.standard.maxPriorityFeePerGas;

      const sponsorUserOperation = await paymasterClient.sponsorUserOperationV1(
        {
          entryPoint: entryPointAddress,
          userOperation: userOperation,
        }
      );
      console.log(sponsorUserOperation);

      userOperation.paymasterAndData = sponsorUserOperation.paymasterAndData;

      const signature = await ztAccount.signUserOperation(userOperation, {});
      console.log(`Signature : ${signature}`);
      userOperation.signature = signature;
      console.log(`Sending User Operation: ${userOperation}`);
      console.log(userOperation);
      const txHash = await bundlerClient.sendUserOperation({
        entryPoint: entryPointAddress,
        userOperation: userOperation,
      });

      console.log(`UserOperation Hash: ${txHash}`);

      if (bundlerClient && txHash) {
        let txReceipt: GetUserOperationReceiptReturnType | undefined;
        do {
          console.log("Getting UserOperation Receipt...");
          txReceipt = await bundlerClient.getUserOperationReceipt({
            hash: txHash,
          });
          if (!txReceipt) {
            await new Promise((resolve) => setTimeout(resolve, 2000)); // Add a 2-second delay
          } else {
            console.log(`Useroperation Receipt : ${txReceipt}`);
          }
        } while (!txReceipt);
      }
    } catch (e) {
      let message;
      if (e instanceof RpcRequestError) {
        console.error(e.details);
        message = e.details;
      } else if (e instanceof PassKeySignatureError) {
        console.error(e.message);
        message = e.message;
      } else {
        console.log(e);
        throw new Error(e.message);
      }
    }
  };

  /**
   * This method is used to verify passkey signature on client side
   * @param publicKeyAsHexString
   * @param userCredentials
   * @returns
   */
  const verifyCredentials = async (
    publicKeyAsHexString: string,
    userCredentials: PublicKeyCredentialDescriptor
  ) => {
    const {
      data: assertion,
      response,
      error,
    } = await get({ allowCredentials: [userCredentials] });
    if (error) {
      console.log("(🪪,❌) Error", error);
      throw new Error(error);
    }
    if (assertion) {
      console.log("(🪪,✅) Assertion", assertion);

      const assertation = response as AuthenticatorAssertionResponse;
      const publicKey = hex2buf(publicKeyAsHexString);
      const verificationData = await verifySignature({
        publicKey,
        assertion: assertation,
      });
      console.log(`verifyCredentials: ${verificationData}`);
      return verificationData;
    }
  };

  /**
   *
   * @param loginWith this kinda specify the data source to get the passkey meta details
   * @param nameOrUsername this is kinda identifier to that passkey meta data
   */
  const handleLogin = async (
    loginWith: "passkey_name" | "username",
    nameOrUsername: string
  ) => {
    // Sanitize the input for security purposes
    const sanitizedInput = sanitizeInput(nameOrUsername);
    if (sanitizedInput.trim() === "") {
      throw new Error("Please enter valid name or username.");
    }

    let credentialId;
    let pubKeyAsHex;
    if (loginWith === "username") {
      // const ensAddress = await ethereumClient.getEnsAddress({
      //   name: normalize(`${nameOrUsername}.${subnameParent}`),
      // });

      const zeroTrustMetaDataRecord = await ethereumClient.getEnsText({
        name: normalize(`${nameOrUsername}.${subnameParent}`),
        key: "zeroTrustMetaData",
      });

      if (!zeroTrustMetaDataRecord) {
        throw new Error(
          `Cannot find the username ${nameOrUsername}.${subnameParent}`
        );
      }
      // console.log(ensAddress); // same as account address

      console.log(zeroTrustMetaDataRecord); // data used for initcode of account

      // Extract the account factory address
      const accountFactoryAddress = `${zeroTrustMetaDataRecord.substring(
        0,
        42
      )}`;
      // Extract the index/salt bytes
      const indexOrSaltBytes = parseInt(
        zeroTrustMetaDataRecord.substring(42, 106),
        16
      );
      // Extract the length of pubKey
      const publicKeyLength = parseInt(
        zeroTrustMetaDataRecord.substring(106, 170),
        16
      );
      // Extract the pubKeyAsHex
      pubKeyAsHex = zeroTrustMetaDataRecord.substring(
        170,
        170 + publicKeyLength
      );
      // Extract the credentialId
      credentialId = hexToString(
        `0x${zeroTrustMetaDataRecord.substring(170 + publicKeyLength)}`
      );

      console.log([
        accountFactoryAddress,
        indexOrSaltBytes,
        publicKeyLength,
        pubKeyAsHex,
        credentialId,
      ]);
    } else if (loginWith === "passkey_name") {
      // inputValue as a passkeyName and get details from local storage

      if (!localPasskeyMetaInfoMap[sanitizedInput]) {
        throw new Error("Cannot find the passkey details on local storage");
      }
      credentialId = localPasskeyMetaInfoMap[sanitizedInput].credentialId;
      pubKeyAsHex = localPasskeyMetaInfoMap[sanitizedInput].publicKeyAsHex;
    }

    const userCredentials: PublicKeyCredentialDescriptor = {
      id: parseBase64url(credentialId),
      type: "public-key",
    };

    const verificationData = await verifyCredentials(
      pubKeyAsHex,
      userCredentials
    );
    console.log("(🪪,✅) Verification", verificationData);
    const _loggedInUser = {
      loginWith: loginWith,
      nameOrUsername: nameOrUsername,
      passkeyMetaInfo: {
        credentialId: credentialId,
        publicKeyAsHex: pubKeyAsHex,
        indexOrSalt: indexOrSaltBytes,
      },
    };
    console.log(verificationData.isValid);
    return verificationData.isValid;
  };

  const sanitizeInput = (input: string) => {
    // Removing leading and trailing spaces
    let sanitizedInput = input.trim();
    // Allow alphanumeric characters, underscores
    sanitizedInput = sanitizedInput.replace(/[^a-zA-Z0-9_@]/g, "");
    return sanitizedInput;
  };

  const createPasskeyAccount = async () => {};
  const backUpAccount = async () => {};

  const sendUserOperation = async (userOpCalldata: `0x${string}`) => {
    if (
      !loggedInUser ||
      !loggedInUser.nameOrUsername ||
      loggedInUser.passkeyMetaInfo
    ) {
      throw new Error("Please Login to send user operation");
    }

    const publicKeyAsHex = loggedInUser.passkeyMetaInfo.publicKeyAsHex;
    const publicKeyAsCryptoKey = await importPublicKeyAsCryptoKey(
      hex2buf(publicKeyAsHex)
    );
    const [pubKeyX, pubKeyY] = await getPublicKeyXYCoordinate(
      publicKeyAsCryptoKey
    );
    const credentialId = loggedInUser.passkeyMetaInfo.credentialId;

    const passkeySigner = new ZeroTrustPasskeyValidator(
      BigInt(pubKeyX),
      BigInt(pubKeyY),
      credentialId
    );

    const ztAccount = new ZeroTrustSmartAccount(ethereumClient, {
      signer: passkeySigner,
      accountFactoryAddress: accountFactoryAddress,
      entryPointAddress: entryPointAddress,
      index: BigInt(0),
    });

    await executeUserOperation(userOpCalldata, ztAccount);
  };

  async function executeUserOperation<
    TSigner extends AccountValidator<TSignerValidatorData>,
    TSignerValidatorData,
    TTransport extends Transport,
    TChain extends Chain
  >(
    userOpCalldata: `0x${string}`,
    ztAccount: ZeroTrustSmartAccount<
      TSigner,
      TSignerValidatorData,
      TTransport,
      TChain
    >
  ) {
    // Getting nonce value for the account
    const nonce = await getAccountNonce(ethereumClient, {
      sender: accountAddress,
      entryPoint: entryPointAddress,
    });

    // Preparing the partial user operation
    const userOperation: UserOperation = {
      callData: userOpCalldata ?? "0x",
      initCode: nonce === BigInt(0) ? await ztAccount.getInitCode() : "0x",
      sender: accountAddress,
      nonce: nonce,
      maxFeePerGas: BigInt(2000000),
      maxPriorityFeePerGas: BigInt(2000000),
      callGasLimit: BigInt(2000000),
      preVerificationGas: BigInt(2000000),
      verificationGasLimit: BigInt(2000000),
      paymasterAndData: "0x",
      signature:
        "0x00000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000170000000000000000000000000000000000000000000000000000000000000001417ad42d8551e4909ae47832ecb19f3f1dcc6d401de925a1dac9795354aef06b1a04cfe1fe086536a0c5da9034788be826d0a32856881de89ef0be4a3b75deec000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e00000000000000000000000000000000000000000000000000000000000000140000000000000000000000000000000000000000000000000000000000000002549960de5880e8c687434170f6476605b8fe4aeb9a28632c7995cf3ba831d9763050000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000867b2274797065223a22776562617574686e2e676574222c226368616c6c656e6765223a225f4b446e774676464534766a666f3154546561306d676a7662546c50397a2d2d71696977566567326f3977222c226f726967696e223a22687474703a2f2f6c6f63616c686f73743a35313733222c2263726f73734f726967696e223a66616c73657d0000000000000000000000000000000000000000000000000000",
    };

    console.log(userOperation);

    const gasPrices = await bundlerClient.getUserOperationGasPrice();
    console.log(`Gas Price: ${gasPrices}`);

    userOperation.maxFeePerGas = gasPrices.standard.maxFeePerGas;
    userOperation.maxPriorityFeePerGas =
      gasPrices.standard.maxPriorityFeePerGas;

    const sponsorUserOperation = await paymasterClient.sponsorUserOperationV1({
      entryPoint: entryPointAddress,
      userOperation: userOperation,
    });
    console.log(sponsorUserOperation);

    userOperation.paymasterAndData = sponsorUserOperation.paymasterAndData;

    const signature = await ztAccount.signUserOperation(userOperation, {});
    console.log(`Signature : ${signature}`);
    userOperation.signature = signature;
    console.log(`Sending User Operation: ${userOperation}`);
    console.log(userOperation);
    const txHash = await bundlerClient.sendUserOperation({
      entryPoint: entryPointAddress,
      userOperation: userOperation,
    });

    console.log(`UserOperation Hash: ${txHash}`);

    if (bundlerClient && txHash) {
      let txReceipt: GetUserOperationReceiptReturnType | undefined;
      do {
        console.log("Getting UserOperation Receipt...");
        txReceipt = await bundlerClient.getUserOperationReceipt({
          hash: txHash,
        });
        if (!txReceipt) {
          await new Promise((resolve) => setTimeout(resolve, 2000)); // Add a 2-second delay
        } else {
          console.log(`Useroperation Receipt : ${txReceipt}`);
        }
      } while (!txReceipt);
    }
  }

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
        handlePasskeyCreation,
        handleUsernameCreation,
        handleLogin,
        createPasskeyAccount,
        backUpAccount,
        isUsernameAvailable,
        sendUserOperation,
      }}
    >
      {children}
    </ApplicationContext.Provider>
  );
};

// Hook
export const useApplicationContext = () => useContext(ApplicationContext);
