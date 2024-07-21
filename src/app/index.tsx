import React from "react"
import * as ReactNative from "react-native"
import * as ExpoRouter from "expo-router"
import ExpoRouterIndex from "components/ExpoRouterIndex"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { apiTokenKeyInAsyncStorage } from "components/ApiTokenProvider"
import useTheme from "hooks/useTheme"
import CenteredLoadingSpinner from "components/CenteredLoadingSpinner"

const initialRouteWhenAuthenticated = "/teams"

export default (): React.ReactElement => {
  const theme = useTheme()
  const router = ExpoRouter.useRouter()

  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    const goToTheLastViewedRouteOnLaunchIfAuthenticated =
      async (): Promise<void> => {
        const apiToken = await AsyncStorage.getItem(apiTokenKeyInAsyncStorage)
        const isAuthenticated = apiToken !== null
        if (isAuthenticated) {
          router.navigate(initialRouteWhenAuthenticated)
        }
        setIsLoading(false)
      }
    goToTheLastViewedRouteOnLaunchIfAuthenticated()
  }, [router])

  return isLoading ? (
    <ReactNative.View
      style={{ flex: 1, backgroundColor: theme.colors.background }}
    >
      <CenteredLoadingSpinner />
    </ReactNative.View>
  ) : (
    <ExpoRouterIndex indexPath="login" />
  )
}
