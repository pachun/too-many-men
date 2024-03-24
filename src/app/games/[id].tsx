import React from "react"
import * as ReactNative from "react-native"
import * as ExpoRouter from "expo-router"
import * as DateFNS from "date-fns"
import CenteredLoadingSpinner from "components/CenteredLoadingSpinner"
import useTheCachedGameFirstOrGetTheGameFromTheApi from "hooks/useTheCachedGameFirstOrGetTheGameFromTheApi"
import LabeledValue from "components/LabeledValue"
import AreYouGoingToThisGame from "components/AreYouGoingToThisGame"
import useShouldShowThe_AreYouGoingToThisGame_Question from "hooks/useShouldShowThe_AreYouGoingToThisGame_Question"
import GameAttendanceList from "components/GameAttendanceList"
import useRefreshableGames from "hooks/useRefreshableGames"
import useUserId from "hooks/useUserId"
import type { Game as GameType } from "types/Game"
import type { RefreshableRequest } from "types/RefreshableRequest"

const setUserIsAttendingGame =
  (userId: number | null, game: GameType | undefined) =>
  (
    refreshableGames: RefreshableRequest<GameType[]>,
  ): RefreshableRequest<GameType[]> => {
    if (
      userId &&
      game &&
      (refreshableGames.status === "Success" ||
        refreshableGames.status === "Refreshing" ||
        refreshableGames.status === "Refresh Error")
    ) {
      return {
        status: refreshableGames.status,
        data: refreshableGames.data.map(currentGame =>
          currentGame.id === game.id
            ? {
                ...currentGame,
                ids_of_players_who_responded_yes_to_attending: [
                  ...new Set([
                    ...game.ids_of_players_who_responded_yes_to_attending,
                    userId,
                  ]),
                ],
              }
            : currentGame,
        ),
      }
    } else {
      return refreshableGames
    }
  }

const Game = (): React.ReactElement => {
  const { id: gameId } = ExpoRouter.useLocalSearchParams()

  const game = useTheCachedGameFirstOrGetTheGameFromTheApi(gameId)

  const { setRefreshableGames } = useRefreshableGames()

  const { userId } = useUserId()

  const dateLabel = React.useMemo((): string => {
    return game?.played_at
      ? DateFNS.format(DateFNS.parseISO(game.played_at), "EEEE, MMM d")
      : ""
  }, [game?.played_at])

  const timeLabel = React.useMemo((): string => {
    return game
      ? DateFNS.format(DateFNS.parseISO(game.played_at), "h:mm a")
      : ""
  }, [game])

  const shouldShowThe_AreYouGoingToThisGame_Question =
    useShouldShowThe_AreYouGoingToThisGame_Question(game)

  const onPlayerAttendanceUpdate = React.useCallback(
    (playerAttendance: "Yes" | "No" | "Maybe") => {
      switch (playerAttendance) {
        case "Yes":
          setRefreshableGames(setUserIsAttendingGame(userId, game))
          break
        case "No":
          "123"
          break
        case "Maybe":
          "123"
          break
      }
    },
    [game, userId, setRefreshableGames],
  )

  return game ? (
    <>
      <ExpoRouter.Stack.Screen options={{ title: dateLabel }} />
      <ReactNative.ScrollView style={{ flex: 1 }}>
        {shouldShowThe_AreYouGoingToThisGame_Question && (
          <>
            <ReactNative.View style={{ height: 20 }} />
            <AreYouGoingToThisGame onChange={onPlayerAttendanceUpdate} />
          </>
        )}
        <ReactNative.View style={{ height: 20 }} />
        <LabeledValue label="Day" value={dateLabel} />
        <ReactNative.View style={{ height: 20 }} />
        <LabeledValue label="Time" value={timeLabel} />
        {game.rink && (
          <>
            <ReactNative.View style={{ height: 20 }} />
            <LabeledValue label="Rink" value={game.rink} />
          </>
        )}
        {game.opposing_teams_name && (
          <>
            <ReactNative.View style={{ height: 20 }} />
            <LabeledValue label="Opponent" value={game.opposing_teams_name} />
          </>
        )}
        <ReactNative.View style={{ height: 20 }} />
        <LabeledValue
          label="Home or Away"
          value={game.is_home_team ? "Home" : "Away"}
        />
        <ReactNative.View style={{ height: 20 }} />
        <GameAttendanceList game={game} />
        <ReactNative.View style={{ height: 20 }} />
      </ReactNative.ScrollView>
    </>
  ) : (
    <>
      <ExpoRouter.Stack.Screen options={{ title: "" }} />
      <CenteredLoadingSpinner />
    </>
  )
}

export default Game
