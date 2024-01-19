import React, { ReactNode, useContext, useState, useEffect } from "react";

// Context
export const ZeroTrustContext = React.createContext({});

// Provider Props Type
interface ZeroTrustProviderProps {
  children: ReactNode;
}

// Provider
export const SmartAccountProvider: React.FC<ZeroTrustProviderProps> = ({
  children,
}) => {
  return (
    <ZeroTrustContext.Provider value={{}}>{children}</ZeroTrustContext.Provider>
  );
};

// Hook
export const useZeroTrustContext = () => useContext(ZeroTrustContext);
