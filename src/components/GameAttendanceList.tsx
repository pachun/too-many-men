import React from "react"
import * as ReactNative from "react-native"
import useTheme from "hooks/useTheme"
import type { Game } from "types/Game"
import GameAttendanceListItem from "components/GameAttendanceListItem"
import VerticalSpacing from "components/VerticalSpacing"
import ForegroundItem from "components/ForegroundItem"
import AppText from "components/AppText"
import type { Player } from "types/Player"

const ListSeparator = (): React.ReactElement => {
  const theme = useTheme()

  return (
    <>
      <ReactNative.View style={{ height: 15 }} />
      <ReactNative.View
        style={{
          width: "100%",
          height: 1,
          borderWidth: 0.25,
          borderColor: theme.colors.background,
        }}
      />
      <ReactNative.View style={{ height: 15 }} />
    </>
  )
}

const playersSortedByGameAttendanceResponseWithYesesFirstNosSecondMaybesThirdAndUnansweredsLast =
  (game: Game): Player[] => {
    return game.ids_of_players_who_responded_yes_to_attending
      .map(
        attendingPlayersId =>
          game.players.find(player => player.id === attendingPlayersId)!,
      )
      .concat(
        game.ids_of_players_who_responded_no_to_attending.map(
          attendingPlayersId =>
            game.players.find(player => player.id === attendingPlayersId)!,
        ),
      )
      .concat(
        game.ids_of_players_who_responded_maybe_to_attending.map(
          attendingPlayersId =>
            game.players.find(player => player.id === attendingPlayersId)!,
        ),
      )
      .concat(
        game.players.filter(
          player =>
            !game.ids_of_players_who_responded_yes_to_attending
              .concat(game.ids_of_players_who_responded_no_to_attending)
              .concat(game.ids_of_players_who_responded_maybe_to_attending)
              .includes(player.id),
        ),
      )
  }

interface GameAttendanceListProps {
  game: Game
}

const GameAttendanceList = ({
  game,
}: GameAttendanceListProps): React.ReactElement => {
  const players = React.useMemo(
    () =>
      playersSortedByGameAttendanceResponseWithYesesFirstNosSecondMaybesThirdAndUnansweredsLast(
        game,
      ),
    [game],
  )

  const isLastPlayer = (index: number): boolean => index === players.length - 1

  return (
    <ForegroundItem>
      <AppText bold style={{ textAlign: "right" }}>
        Attendance
      </AppText>
      <VerticalSpacing />
      <>
        {players.map(
          (player, index): React.ReactElement => (
            <ReactNative.View key={player.id}>
              <GameAttendanceListItem player={player} game={game} />
              {isLastPlayer(index) ? null : <ListSeparator />}
            </ReactNative.View>
          ),
        )}
      </>
    </ForegroundItem>
  )
}

export default GameAttendanceList
