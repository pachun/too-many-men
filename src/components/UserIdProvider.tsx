import React from "react"
import type { Provider as ProviderType } from "types/Provider"
import emptyPromiseReturningFunctionForInitializingContexts from "helpers/emptyPromiseReturningFunctionForInitializingContexts"
import useStateSyncedWithAsyncStorage from "hooks/useStateSyncedWithAsyncStorage"

export interface UserIdContextType {
  userId: number | null
  setUserId: (userId: number) => Promise<void>
}

export const UserIdContext = React.createContext<UserIdContextType>({
  userId: null,
  setUserId: emptyPromiseReturningFunctionForInitializingContexts,
})

const UserIdProvider: ProviderType = ({ children }) => {
  const [userId, setUserId] = useStateSyncedWithAsyncStorage<number>(
    "User ID",
    Number,
  )

  return (
    <UserIdContext.Provider value={{ userId, setUserId }}>
      {children}
    </UserIdContext.Provider>
  )
}

export default UserIdProvider
