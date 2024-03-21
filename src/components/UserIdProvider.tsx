import React from "react"
import type { Provider as ProviderType } from "types/Provider"
import emptyPromiseReturningFunctionForInitializingContexts from "helpers/emptyPromiseReturningFunctionForInitializingContexts"
import AsyncStorage from "@react-native-async-storage/async-storage"

export interface UserIdContextType {
  userId: number | null
  setUserId: (userId: number) => Promise<void>
}

export const UserIdContext = React.createContext<UserIdContextType>({
  userId: null,
  setUserId: emptyPromiseReturningFunctionForInitializingContexts,
})

const UserIdProvider: ProviderType = ({ children }) => {
  const [userIdInContext, setUserIdInContext] = React.useState<number | null>(
    null,
  )

  const setUserId = async (userId: number): Promise<void> => {
    setUserIdInContext(userId)
    await AsyncStorage.setItem("User ID", userId.toString())
  }

  React.useEffect(() => {
    const setUserIdInContextFromUserIdInAsyncStorageOnMount =
      async (): Promise<void> => {
        setUserIdInContext(Number(await AsyncStorage.getItem("User ID")))
      }
    setUserIdInContextFromUserIdInAsyncStorageOnMount()
  }, [])

  return (
    <UserIdContext.Provider value={{ userId: userIdInContext, setUserId }}>
      {children}
    </UserIdContext.Provider>
  )
}

export default UserIdProvider
