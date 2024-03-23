import React from "react"
import type { Provider as ProviderType } from "types/Provider"
import emptyPromiseReturningFunctionForInitializingContexts from "helpers/emptyPromiseReturningFunctionForInitializingContexts"
import useStateSyncedWithAsyncStorage from "hooks/useStateSyncedWithAsyncStorage"

export interface ApiTokenContextType {
  apiToken: string | null
  setApiToken: (apiToken: string) => Promise<void>
}

export const ApiTokenContext = React.createContext<ApiTokenContextType>({
  apiToken: null,
  setApiToken: emptyPromiseReturningFunctionForInitializingContexts,
})

const ApiTokenProvider: ProviderType = ({ children }) => {
  const [apiToken, setApiToken] = useStateSyncedWithAsyncStorage<string>(
    "API Token",
    thing => thing,
  )

  return (
    <ApiTokenContext.Provider value={{ apiToken, setApiToken }}>
      {children}
    </ApiTokenContext.Provider>
  )
}

export default ApiTokenProvider
