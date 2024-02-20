"use client";

import React, { createContext, useContext, useState } from "react";

// Define the type for the default value
interface VignetteContextType {
  isVignetteVisible: boolean;
  displayVignette: () => void;
  hideVignette: () => void;
}

// Create the context with a default value
const defaultValue: VignetteContextType = {
  isVignetteVisible: false,
  displayVignette: () => {},
  hideVignette: () => {},
};

// Create the context
const VignetteContext = createContext(defaultValue);

// VignetteProvider component
export const VignetteProvider = ({ children }: any) => {
  const [isVignetteVisible, setIsVignetteVisible] = useState(false);

  const displayVignette = () => {
    setIsVignetteVisible(true);
  };

  const hideVignette = () => {
    setIsVignetteVisible(false);
  };

  return (
    <VignetteContext.Provider value={{ isVignetteVisible, displayVignette, hideVignette }}>
      {children}
    </VignetteContext.Provider>
  );
};

// useVignette hook
export const useVignette = () => useContext(VignetteContext);
