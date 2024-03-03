import * as ExpoRouter from "expo-router"

const index = (): React.ReactElement => {
  return <ExpoRouter.Redirect href="/players" />
}

export default index
