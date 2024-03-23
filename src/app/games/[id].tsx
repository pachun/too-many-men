import React from "react"
import * as ReactNative from "react-native"
import * as ExpoRouter from "expo-router"
import * as DateFNS from "date-fns"
import CenteredLoadingSpinner from "components/CenteredLoadingSpinner"
import useTheCachedGameFirstOrGetTheGameFromTheApi from "hooks/useTheCachedGameFirstOrGetTheGameFromTheApi"
import LabeledValue from "components/LabeledValue"
import AreYouGoingToThisGame from "components/AreYouGoingToThisGame"
import type { Game as GameType } from "types/Game"
import useEffectEverySecond from "hooks/useEffectEverySecond"

const isTheGameInTheFuture = (game: GameType): boolean => {
  const currentTime = new Date()
  const gameTime = DateFNS.parseISO(game.played_at)
  return DateFNS.isBefore(currentTime, gameTime)
}

const Game = (): React.ReactElement => {
  const { id: gameId } = ExpoRouter.useLocalSearchParams()

  const game = useTheCachedGameFirstOrGetTheGameFromTheApi(gameId)

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

  const [theGameIsInTheFuture, setTheGameIsInTheFuture] = React.useState(
    game ? isTheGameInTheFuture(game) : false,
  )

  const updateWhetherOrNotTheGameIsInTheFuture = React.useCallback(() => {
    if (game) {
      setTheGameIsInTheFuture(isTheGameInTheFuture(game))
    }
  }, [game])

  useEffectEverySecond(updateWhetherOrNotTheGameIsInTheFuture)

  const shouldShowAreYouGoingToThisGameQuestion = React.useMemo(
    () => theGameIsInTheFuture,
    [theGameIsInTheFuture],
  )

  return game ? (
    <>
      <ExpoRouter.Stack.Screen options={{ title: dateLabel }} />
      <ReactNative.View style={{ flex: 1 }}>
        {shouldShowAreYouGoingToThisGameQuestion && (
          <>
            <ReactNative.View style={{ height: 20 }} />
            <AreYouGoingToThisGame onChange={() => {}} />
          </>
        )}
        <ReactNative.View style={{ height: 20 }} />
        <LabeledValue label="Day" value={dateLabel} />
        <ReactNative.View style={{ height: 20 }} />
        <LabeledValue label="Time" value={timeLabel} />
        <ReactNative.View style={{ height: 20 }} />
        {game.rink && (
          <>
            <LabeledValue label="Rink" value={game.rink} />
            <ReactNative.View style={{ height: 20 }} />
          </>
        )}
        {game.opposing_teams_name && (
          <>
            <LabeledValue label="Opponent" value={game.opposing_teams_name} />
            <ReactNative.View style={{ height: 20 }} />
          </>
        )}
        <LabeledValue
          label="Home or Away"
          value={game.is_home_team ? "Home" : "Away"}
        />
      </ReactNative.View>
    </>
  ) : (
    <>
      <ExpoRouter.Stack.Screen options={{ title: "" }} />
      <CenteredLoadingSpinner />
    </>
  )
}

export default Game
