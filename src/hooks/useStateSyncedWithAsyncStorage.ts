import React from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"

type ThingType<T> = T | null
type SetThingType<T> = (thing: T | null) => Promise<void>
type ReturnType<T> = [ThingType<T>, SetThingType<T>]

const useStateSyncedWithAsyncStorage = <T>(
  asyncStorageKey: string,
  transformer: (value: string) => T,
): ReturnType<T> => {
  const [thing, setThingInState] = React.useState<ThingType<T>>(null)

  const setThingInStateAndAsyncStorage: SetThingType<T> = async thing => {
    if (thing !== null) {
      setThingInState(thing)
      await AsyncStorage.setItem(
        asyncStorageKey,
        typeof thing === "string"
          ? (thing as string)
          : (thing as number).toString(),
      )
    } else {
      setThingInState(null)
      await AsyncStorage.removeItem(asyncStorageKey)
    }
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
