import * as ExpoRouter from "expo-router"
import type { UnstableSettings } from "types/UnstableSettings"

// https://docs.expo.dev/router/reference/faq/#missing-back-button
export const unstable_settings: UnstableSettings = {
  initialRouteName: "index",
}

const Layout = (): React.ReactElement => (
  <ExpoRouter.Stack
    screenOptions={{ headerTitleStyle: { fontSize: 20, fontWeight: "bold" } }}
  >
    <ExpoRouter.Stack.Screen name="new" options={{ presentation: "modal" }} />
  </ExpoRouter.Stack>
)

export default Layout
