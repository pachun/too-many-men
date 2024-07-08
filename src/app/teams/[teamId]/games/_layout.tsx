import * as ExpoRouter from "expo-router"

const Layout = (): React.ReactElement => (
  <ExpoRouter.Stack
    screenOptions={{ headerTitleStyle: { fontSize: 20, fontWeight: "bold" } }}
  />
)

export default Layout
