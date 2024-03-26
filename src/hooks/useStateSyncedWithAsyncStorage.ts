import React from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"

const useStateSyncedWithAsyncStorage = <T>(
  asyncStorageKey: string,
  transformer: (value: string) => T,
): [T | null, (thing: T) => Promise<void>] => {
  const [thing, setThingInState] = React.useState<T | null>(null)

  const setThingInStateAndAsyncStorage = async (thing: T): Promise<void> => {
    setThingInState(thing)
    await AsyncStorage.setItem(
      asyncStorageKey,
      (thing as string | number).toString(),
    )
  }

  React.useEffect(() => {
    const setStateValueFromAsyncStorageValueOnMount =
      async (): Promise<void> => {
        const thingInAsyncStorage = await AsyncStorage.getItem(asyncStorageKey)
        setThingInState(transformer(thingInAsyncStorage || ""))
      }
    setStateValueFromAsyncStorageValueOnMount()
  }, [setThingInState, asyncStorageKey, transformer])

  return [thing, setThingInStateAndAsyncStorage]
}

export default useStateSyncedWithAsyncStorage
