import {
  create,
  getPublicKeyFromAttestationResponse,
  getPublicKeyXYCoordinate,
  hex2buf,
  importPublicKeyAsCryptoKey,
} from "zero-trust-passkey";

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
    setCounterfactualAddress(passkeyInfo.accountAddress);
    setPasskeyCreated(true);
    handleNext();
  }
  setLoading(false);
};
