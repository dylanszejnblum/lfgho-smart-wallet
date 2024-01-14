import * as React from "react";
import {
  Connector,
  useConnect,
  useAccount,
  useDisconnect,
  useEnsAvatar,
  useEnsName,
} from "wagmi";

const send = () => {
  const { connectors, connect } = useConnect();
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: ensName } = useEnsName({ address });
  const { data: ensAvatar } = useEnsAvatar({ name: ensName! });
  return (
    <div>
      {connectors.map((connector) => {
        return (
          <button key={connector.uid} onClick={() => connect({ connector })}>
            {connector.name}
          </button>
        );
      })}

      <div>
        <div> {address} </div>
        <button onClick={() => disconnect()}>Disconnect</button>
      </div>
    </div>
  );
};

export default send;
