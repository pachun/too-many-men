import React from "react"
import * as ReactNative from "react-native"
import * as ExpoRouter from "expo-router"
import * as DateFNS from "date-fns"
import CenteredLoadingSpinner from "components/CenteredLoadingSpinner"
import useTheCachedGameFirstOrGetTheGameFromTheApi from "hooks/useTheCachedGameFirstOrGetTheGameFromTheApi"
import LabeledValue from "components/LabeledValue"
import AreYouGoingToThisGame from "components/AreYouGoingToThisGame"
import GameAttendanceList from "components/GameAttendanceList"
import VerticalSpacing from "components/VerticalSpacing"
import BackButtonWithTestId from "components/BackButonWithTestId"

const Game = (): React.ReactElement => {
  const { teamId, gameId } = ExpoRouter.useLocalSearchParams()

  const game = useTheCachedGameFirstOrGetTheGameFromTheApi({ teamId, gameId })

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

  return game ? (
    <>
      <ExpoRouter.Stack.Screen
        options={{
          title: dateLabel,
          headerLeft: () => (
            <BackButtonWithTestId
              title="Games"
              route={`/teams/${teamId}/games`}
            />
          ),
        }}
      />
      <ReactNative.ScrollView style={{ flex: 1 }}>
        <AreYouGoingToThisGame game={game} />
        <LabeledValue label="Day" value={dateLabel} />
        <LabeledValue label="Time" value={timeLabel} />
        {game.rink && <LabeledValue label="Rink" value={game.rink} />}
        {game.opposing_teams_name && (
          <LabeledValue label="Opponent" value={game.opposing_teams_name} />
        )}
        <LabeledValue
          label="Home or Away"
          value={game.is_home_team ? "Home" : "Away"}
        />
        <GameAttendanceList game={game} />
        <VerticalSpacing />
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
