"use client";

import React, { createContext, useContext, useState } from "react";

// Define the type for the default value
interface VignetteContextType {
  isVignetteVisible: boolean;
  toggleVignette: () => void;
}

// Create the context with a default value
const defaultValue: VignetteContextType = {
  isVignetteVisible: false,
  toggleVignette: () => {},
};

// Create the context
const VignetteContext = createContext(defaultValue);

// VignetteProvider component
export const VignetteProvider = ({ children }: any) => {
  const [isVignetteVisible, setIsVignetteVisible] = useState(false);

  const toggleVignette = () => {
    setIsVignetteVisible(!isVignetteVisible);
  };

  return (
    <VignetteContext.Provider value={{ isVignetteVisible, toggleVignette }}>
      {children}
    </VignetteContext.Provider>
  );
};

// useVignette hook
export const useVignette = () => useContext(VignetteContext);
