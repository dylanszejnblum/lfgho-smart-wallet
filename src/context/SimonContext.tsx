import React, { ReactNode, useContext, useState, useEffect } from "react";

// Context
export const SimonAppContext = React.createContext({});

// Provider Props Type
interface SimonAppProviderProps {
  children: ReactNode;
}

// Provider
export const SmartAccountProvider: React.FC<SimonAppProviderProps> = ({
  children,
}) => {
  return (
    <SimonAppContext.Provider value={{}}>{children}</SimonAppContext.Provider>
  );
};

// Hook
export const useSimonAppContext = () => useContext(SimonAppContext);
