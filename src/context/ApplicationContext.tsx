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
import { useLocalStorage } from "usehooks-ts";
import {
  foreverSubdomainAvailableAbi,
  setAddressRecordPublicResolverAbi,
  setNameRecordPublicResolverAbi,
  setTextRecordPublicResolverAbi,
  zeroTrustDomainRegisterAbi,
} from "@/utils/contracts/Subdomain";
import {
  PassKeySignatureError,
  ZeroTrustPasskeyValidator,
  ZeroTrustSmartAccount,
} from "zero-trust-core-sdk";
import { toast } from "sonner";
import { sepolia } from "viem/chains";
import {
  GetUserOperationReceiptReturnType,
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
  handleLogin: (loginWith: string, nameOrUsername: string) => {};
  isUsernameAvailable: (username: string) => Promise<Boolean>;
  createPasskeyAccount: () => Promise<void>;
  backUpAccount: () => Promise<void>;
  sendUserOperation: () => Promise<void>;
};

type PasskeyMetaInfo = {
  accountAddress?: `0x${string}`;
  credentialId?: string;
  credentialRawId?: string;
  publicKeyAsHex?: string;
};

type LoggedInUser = {
  username?: `${string}.0trust.eth`;
  passkeyName?: string;
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
  handleLogin: async () => {},
  createPasskeyAccount: async () => {},
  backUpAccount: async () => {},
  isUsernameAvailable: (async) => {},
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
  const [localPasskeyMetaInfoMap, setLocalPasskeyMetaInfoMap] =
    useLocalStorage<LocalPasskeyMetaInfoMap>("localPasskeyMetaInfoMap", {});

  const foreverSubdomainRegistrar =
    "0x9B46528dFB626791E138dFb43E5224848E4469c6";

  useEffect(() => {
    const setClientsData = async () => {
      const ethereumClient = createPublicClient({
        chain: sepolia, //baseGoerli,
        transport: http(),
      });
      const _chain = "sepolia"; // 'base-goerli'
      const apiKey = process.env.NEXT_PUBLIC_PIMLICO_API_KEY;
      const pimlicoPaymasterEndpoint = `https://api.pimlico.io/v1/${_chain}/rpc?apikey=${apiKey}`;
      const bundlerEndpoint = `https://api.pimlico.io/v1/${_chain}/rpc?apikey=${apiKey}`;

      const bundlerClient = createPimlicoBundlerClient({
        chain: sepolia, //baseGoerli,
        transport: http(bundlerEndpoint),
      });

      const pimlicoPaymasterClient = createPimlicoPaymasterV1Client({
        chain: sepolia, //baseGoerli,
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
    // handleNext();
    // setCounterfactualAddress(localPasskeyMetaInfoMap[passkeyName].accountAddress)
    // setPasskeyCreated(true)
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
      // Save the information in the usernamePasskeyInfoMap

      setLocalPasskeyMetaInfoMap((prevMap) => ({
        ...prevMap,
        [passkeyName]: passkeyInfo,
      }));
      setAccountAddress(passkeyInfo.accountAddress);
    }
  };

  const isUsernameAvailable = async (username: string): Promise<boolean> => {
    const isAvailable = await ethereumClient.readContract({
      address: foreverSubdomainRegistrar,
      abi: foreverSubdomainAvailableAbi,
      functionName: "available",
      args: [namehash(`${username}.0trust.eth`)],
    });
    return isAvailable;
  };

  const handleUsernameCreation = async (
    username: string,
    passkeyName: string
  ) => {
    const isAvailable = await isUsernameAvailable(username);
    if (!isAvailable) {
      toast(`Username NOT available`);

      return;
    }
    try {
      const publicKeyAsHex =
        localPasskeyMetaInfoMap[passkeyName].publicKeyAsHex;
      const publicKeyAsCryptoKey = await importPublicKeyAsCryptoKey(
        hex2buf(publicKeyAsHex)
      );
      const credentialId = localPasskeyMetaInfoMap[passkeyName].credentialId;
      const [pubKeyX, pubKeyY] = await getPublicKeyXYCoordinate(
        publicKeyAsCryptoKey
      );
      const passkeySigner = new ZeroTrustPasskeyValidator(
        BigInt(pubKeyX),
        BigInt(pubKeyY),
        credentialId
      );

      const ztAccount = new ZeroTrustSmartAccount(ethereumClient, {
        signer: passkeySigner,
        accountFactoryAddress: "0x91161e6d7E9B6eCDb488467A5bd8A526C5f75A33",
        entryPointAddress: entryPointAddress,
        index: BigInt(0),
      });
      console.log(`Account Address: ${await ztAccount.getAddress()}`);
      const accountAddress = getAddress(
        localPasskeyMetaInfoMap[passkeyName].accountAddress
      );
      // create userOperation to register a ens subdomain of zerotrust.eth
      const publicResolverAddress =
        "0x8FADE66B79cC9f707aB26799354482EB93a5B7dD";

      const subnameLabel = username;
      const subnameRoot = "0trust.eth";
      const parentNode = namehash(subnameRoot);
      const textSubname = `${subnameLabel}.${subnameRoot}`;
      const subdomainNode = namehash(textSubname);
      console.log(`namehash of ${textSubname} : ${subdomainNode}`);
      console.log(`namehash of ${subnameRoot} : ${parentNode}`);

      const setAddressRecordCalldata = encodeFunctionData({
        abi: setAddressRecordPublicResolverAbi,
        functionName: "setAddr",
        args: [subdomainNode, accountAddress],
      }) as Hex;

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
        args: [subdomainNode, textRecordKey, textRecordValue],
      }) as Hex;

      const setNameRecordCalldata = encodeFunctionData({
        abi: setNameRecordPublicResolverAbi,
        functionName: "setName",
        args: [subdomainNode, textSubname],
      }) as Hex;

      const registerCalldata = encodeFunctionData({
        abi: zeroTrustDomainRegisterAbi,
        functionName: "register",
        args: [
          parentNode,
          subnameLabel,
          accountAddress,
          publicResolverAddress,
          0,
          [
            setAddressRecordCalldata,
            setNameRecordCalldata,
            setTextRecordCalldata,
          ], //,setNameRecordCalldata,setTextRecordCalldata
        ],
      }) as Hex;

      const userOpCalldata = await ztAccount.encodeExecuteBatchCallData([
        {
          to: foreverSubdomainRegistrar,
          value: BigInt(0),
          data: registerCalldata,
        },
      ]);
      const initCode = await ztAccount.getInitCode();

      const nonce = await getAccountNonce(ethereumClient, {
        sender: accountAddress,
        entryPoint: entryPointAddress,
      });
      const userOperation: UserOperation = {
        callData: userOpCalldata, //'0x',//userOpCalldata,
        initCode: nonce === BigInt(0) ? initCode : "0x",
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
      const receipt = await bundlerClient.getUserOperationReceipt({
        hash: txHash,
      });

      console.log(`UserOperation Receipt: ${receipt}`);
      if (bundlerClient && txHash) {
        let txReceipt: GetUserOperationReceiptReturnType | undefined;
        do {
          txReceipt = await bundlerClient.getUserOperationReceipt({
            hash: txHash,
          });
          if (!txReceipt) {
            await new Promise((resolve) => setTimeout(resolve, 2000)); // Add a 2-second delay
          } else {
            console.log(txReceipt);
          }
        } while (!txReceipt);
      }
    } catch (e) {
      let message;
      if (e instanceof RpcRequestError) {
        console.error(e.details);
        message = e.details;
      }
      if (e instanceof PassKeySignatureError) {
        console.error(e.message);
        message = e.message;
      }
      console.log(e);
      toast("test");
    }
  };

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
      toast("error asertion");
    }
    if (assertion) {
      console.log("(🪪,✅) Assertion", assertion);

      const assertation = response as AuthenticatorAssertionResponse;
      const publicKey = hex2buf(publicKeyAsHexString);
      const verificationData = await verifySignature({
        publicKey,
        assertion: assertation,
      });
      toast("authentication something..");
      return verificationData;
    }
  };

  const handleLogin = async (loginWith: string, nameOrUsername: string) => {
    let dataSource;
    let verificationData: Verification;
    let _loggedInUser: LoggedInUser;

    try {
      // Sanitize the input for security purposes
      const sanitizedInput = sanitizeInput(nameOrUsername);
      if (sanitizedInput.trim() === "") {
        console.log("Please enter your name or username.");
      } else if (loginWith === "username") {
        dataSource = "username";
        const ensAddress = await ethereumClient.getEnsAddress({
          // name: normalize(`${passkeyDisplayName}.zerotrust.eth`),
          name: normalize(`${nameOrUsername}.0trust.eth`),
        });
        const zeroTrustMetaDataRecord = await ethereumClient.getEnsText({
          name: normalize(`${nameOrUsername}.0trust.eth`),
          key: "zeroTrustMetaData",
        });

        console.log(ensAddress);
        console.log(zeroTrustMetaDataRecord);

        // const accountAddress = zeroTrustMetaDataRecord.substring(0, 42); // Extract the account address
        const accountFactoryAddress = `${zeroTrustMetaDataRecord.substring(
          0,
          42
        )}`; // Extract the account factory address
        const zeroBytes = parseInt(
          zeroTrustMetaDataRecord.substring(42, 106),
          16
        ); // Extract the zero bytes
        const publicKeyLength = parseInt(
          `${zeroTrustMetaDataRecord.substring(106, 170)}`,
          16
        ); // Extract the pubKeyX
        const pubKeyAsHex = `${zeroTrustMetaDataRecord.substring(
          170,
          170 + publicKeyLength
        )}`; // Extract the pubKeyY
        const credentialId = hexToString(
          `0x${zeroTrustMetaDataRecord.substring(170 + publicKeyLength)}`
        ); // Extract the credentialId
        console.log([
          accountFactoryAddress,
          zeroBytes,
          publicKeyLength,
          pubKeyAsHex,
          credentialId,
        ]);
        _loggedInUser = {
          username: `${nameOrUsername}.0trust.eth`,
          passkeyMetaInfo: {
            credentialId: credentialId,
            publicKeyAsHex: pubKeyAsHex,
          },
        };

        const userCredentials: PublicKeyCredentialDescriptor = {
          id: parseBase64url(credentialId),
          type: "public-key",
        };
        const publicKeyAsHexString = pubKeyAsHex;
        verificationData = await verifyCredentials(
          publicKeyAsHexString,
          userCredentials
        );
        console.log("(🪪,✅) Verification", verificationData);
      } else if (loginWith === "passkey_name") {
        dataSource = "passkey";
        // consider inputValue as a name and get details from local storage
        if (localPasskeyMetaInfoMap[sanitizedInput]) {
          const userCredentials: PublicKeyCredentialDescriptor = {
            id: parseBase64url(
              localPasskeyMetaInfoMap[sanitizedInput].credentialId
            ),
            type: "public-key",
          };
          const publicKeyAsHexString =
            localPasskeyMetaInfoMap[sanitizedInput].publicKeyAsHex;
          verificationData = await verifyCredentials(
            publicKeyAsHexString,
            userCredentials
          );
          _loggedInUser = {
            passkeyName: nameOrUsername,
            passkeyMetaInfo: {
              credentialId:
                localPasskeyMetaInfoMap[sanitizedInput].credentialId,
              publicKeyAsHex: publicKeyAsHexString,
            },
          };
          console.log("(🪪,✅) Verification", verificationData);
        } else {
          console.log("User not found.");
        }
      }
      // console.log('redirect_url in login page',searchParams.get('redirect_url'))
      // console.log(searchParams)
      //   if (searchParams.has("redirect_url") && verificationData.isValid) {
      //     navigate(`${searchParams.get("redirect_url")}&user=${sanitizedInput}`);
      //   } else if (verificationData.isValid && _loggedInUser) {

      //   }
      console.log(verificationData.isValid);
    } catch (error) {
      console.log(error);
    }
  };

  const sanitizeInput = (input: string) => {
    // Removing leading and trailing spaces
    let sanitizedInput = input.trim();
    // Allow alphanumeric characters, underscores
    sanitizedInput = sanitizedInput.replace(/[^a-zA-Z0-9_@]/g, "");
    return sanitizedInput;
  };

  //   const handleLoginWithPasskey = async (passkeyName: string) => {};
  //   const handleLoginWithUsername = async (username: string) => {};

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
