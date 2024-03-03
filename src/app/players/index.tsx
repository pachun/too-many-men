import * as ExpoRouter from "expo-router"
import type { Player } from "types/Player"
import PlayerList from "components/PlayerList"
import RefreshableResourceList from "components/RefreshableResourceList"

const Players = (): React.ReactElement => (
  <>
    <ExpoRouter.Stack.Screen options={{ title: "Team" }} />
    <RefreshableResourceList<Player>
      resourceApiPath="/players"
      ListComponent={PlayerList}
    />
  </>
)

export default Players
