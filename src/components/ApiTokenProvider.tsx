import React from "react"
import type { Provider as ProviderType } from "types/Provider"
import emptyPromiseReturningFunctionForInitializingContexts from "helpers/emptyPromiseReturningFunctionForInitializingContexts"
import AsyncStorage from "@react-native-async-storage/async-storage"

export interface ApiTokenContextType {
  apiToken: string | null
  setApiToken: (apiToken: string) => Promise<void>
}

export const ApiTokenContext = React.createContext<ApiTokenContextType>({
  apiToken: null,
  setApiToken: emptyPromiseReturningFunctionForInitializingContexts,
})

const ApiTokenProvider: ProviderType = ({ children }) => {
  const [apiTokenInContext, setApiTokenInContext] = React.useState<
    string | null
  >(null)

  const setApiToken = async (apiToken: string): Promise<void> => {
    setApiTokenInContext(apiToken)
    await AsyncStorage.setItem("API Token", apiToken)
  }

  React.useEffect(() => {
    const setApiTokenInContextFromApiTokenInAsyncStorageOnMount =
      async (): Promise<void> => {
        setApiTokenInContext(await AsyncStorage.getItem("API Token"))
      }
    setApiTokenInContextFromApiTokenInAsyncStorageOnMount()
  }, [])

  return (
    <ApiTokenContext.Provider
      value={{ apiToken: apiTokenInContext, setApiToken }}
    >
      {children}
    </ApiTokenContext.Provider>
  )
}

export default ApiTokenProvider
