import React from "react"
import * as ExpoRouter from "expo-router"
import ExpoRouterIndex from "components/ExpoRouterIndex"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { apiTokenKeyInAsyncStorage } from "components/ApiTokenProvider"

const initialRouteWhenAuthenticated = "/teams"

export default (): React.ReactElement => {
  const router = ExpoRouter.useRouter()

  React.useEffect(() => {
    const goToTheLastViewedRouteOnLaunchIfAuthenticated =
      async (): Promise<void> => {
        const apiToken = await AsyncStorage.getItem(apiTokenKeyInAsyncStorage)
        const isAuthenticated = apiToken !== null
        if (isAuthenticated) {
          router.navigate(initialRouteWhenAuthenticated)
        }
      }
    goToTheLastViewedRouteOnLaunchIfAuthenticated()
  }, [router])

  return <ExpoRouterIndex indexPath="login" />
}
