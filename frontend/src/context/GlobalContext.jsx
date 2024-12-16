// Import required libraries
import React, { createContext, useState, useContext } from "react";

// Create the context
const GlobalContext = createContext();

// Create a provider component
export const GlobalProvider = ({ children }) => {
  // Define the state for Google login details
  const [googleLoginDetails, setGoogleLoginDetails] = useState({});

  // Provide the state and its setter
  return (
    <GlobalContext.Provider
      value={{
        googleLoginDetails,
        setGoogleLoginDetails,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

// Custom hook to use the GlobalContext
export const useGlobalContext = () => {
  return useContext(GlobalContext);
};
