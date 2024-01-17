"use client";
import * as React from "react";
import { Connector, useConnect, useAccount, useDisconnect } from "wagmi";
import { useSmartAccountContext } from "@/context/SmartAccountContext";

const send = () => {
  const { connectors, connect } = useConnect();
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const { smartAddress } = useSmartAccountContext();

  return (
    <div>
      {connectors.map((connector) => {
        return (
          <button onClick={() => connect({ connector })}>
            {connector.name}
          </button>
        );
      })}

      <div>
        <div> {address} </div>
        <div>{smartAddress}</div>
        <button onClick={() => disconnect()}>Disconnect</button>
      </div>
    </div>
  );
};

export default send;
