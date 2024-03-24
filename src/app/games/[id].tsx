import React from "react"
import * as ReactNative from "react-native"
import * as ExpoRouter from "expo-router"
import * as DateFNS from "date-fns"
import CenteredLoadingSpinner from "components/CenteredLoadingSpinner"
import useTheCachedGameFirstOrGetTheGameFromTheApi from "hooks/useTheCachedGameFirstOrGetTheGameFromTheApi"
import LabeledValue from "components/LabeledValue"
import AreYouGoingToThisGame from "components/AreYouGoingToThisGame"
import useShouldShowThe_AreYouGoingToThisGame_Question from "hooks/useShouldShowThe_AreYouGoingToThisGame_Question"
import useTheme from "hooks/useTheme"
import GameAttendanceList from "components/GameAttendanceList"

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

  const shouldShowThe_AreYouGoingToThisGame_Question =
    useShouldShowThe_AreYouGoingToThisGame_Question(game)

  const theme = useTheme()

  return game ? (
    <>
      <ExpoRouter.Stack.Screen options={{ title: dateLabel }} />
      <ReactNative.ScrollView style={{ flex: 1 }}>
        {shouldShowThe_AreYouGoingToThisGame_Question && (
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
        <ReactNative.View style={{ height: 20 }} />
        <GameAttendanceList players={game.players} />
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
