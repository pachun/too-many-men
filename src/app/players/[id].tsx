import React from "react"
import * as ReactNative from "react-native"
import * as ExpoRouter from "expo-router"
import Config from "Config"
import type { Player as PlayerType } from "types/Player"
import formatPhoneNumber from "helpers/formatPhoneNumber"
import RefreshablePlayersContext from "components/PlayersProvider"
import useTheme from "hooks/useTheme"

const Player = (): React.ReactElement => {
  const { id: playerId } = ExpoRouter.useLocalSearchParams()

  const [player, setPlayer] = React.useState<PlayerType>()

  const { refreshablePlayers } = React.useContext(RefreshablePlayersContext)

  ExpoRouter.useFocusEffect(
    React.useCallback(() => {
      const getPlayer = async (): Promise<void> => {
        const getPlayerFromCache = (): PlayerType | undefined => {
          if (
            refreshablePlayers.status === "Success" ||
            refreshablePlayers.status === "Refreshing" ||
            refreshablePlayers.status === "Refresh Error"
          ) {
            return refreshablePlayers.data.find(
              refreshablePlayer => refreshablePlayer.id === Number(playerId),
            )
          }
        }

        const getPlayerFromApi = async (): Promise<PlayerType> => {
          return await (
            await fetch(Config.apiUrl + `/players/${playerId}`)
          ).json()
        }

        const cachedPlayer = getPlayerFromCache()

        setPlayer(cachedPlayer ? cachedPlayer : await getPlayerFromApi())
      }

      getPlayer()
    }, [playerId, refreshablePlayers]),
  )

  const theme = useTheme()

  const navigationBarTitleLabel = React.useMemo(
    () => `${player?.first_name} ${player?.last_name}`,
    [player],
  )

  const formattedPhoneNumberLabel = React.useMemo(() => {
    return player?.phone_number ? formatPhoneNumber(player?.phone_number) : ""
  }, [player?.phone_number])

  const formattedJerseyNumberLabel = React.useMemo(() => {
    return player?.jersey_number ? `#${player.jersey_number}` : ""
  }, [player?.jersey_number])

  return (
    <ReactNative.View>
      <ExpoRouter.Stack.Screen options={{ title: navigationBarTitleLabel }} />
      <ReactNative.Text style={{ color: theme.colors.text }}>
        {formattedPhoneNumberLabel}
      </ReactNative.Text>
      <ReactNative.Text style={{ color: theme.colors.text }}>
        {formattedJerseyNumberLabel}
      </ReactNative.Text>
    </ReactNative.View>
  )
}

export default Player
