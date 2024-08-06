import { View, Text } from 'react-native'
import { createContext, useContext, useState, useEffect } from 'react'

const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
  return (
    <GlobalContext.Provider>

    </GlobalContext.Provider>
  )
}

export default GlobalProvider