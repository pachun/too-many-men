import React from "react"
import * as ReactNative from "react-native"
import * as DateFNS from "date-fns"
import type { Game } from "types/Game"

export const paddingLeft = 10

interface GameListItemProps {
  game: Game
}

const GameListItem = ({ game }: GameListItemProps): React.ReactElement => {
  const formattedDate = React.useMemo((): string => {
    return DateFNS.format(DateFNS.parseISO(game.played_at), "MMM d")
  }, [game.played_at])

  const formattedTime = React.useMemo((): string => {
    return DateFNS.format(DateFNS.parseISO(game.played_at), "h:mm a")
  }, [game.played_at])

  const outcome = React.useMemo((): "win" | "loss" | "tie" | "unplayed" => {
    if (game.goals_for !== undefined && game.goals_against !== undefined) {
      if (game.goals_for > game.goals_against) {
        return "win"
      } else if (game.goals_for < game.goals_against) {
        return "loss"
      }
      return "tie"
    }
    return "unplayed"
  }, [game.goals_for, game.goals_against])

  const formattedScore = React.useMemo((): string => {
    if (outcome !== "unplayed") {
      return `${game.goals_for} - ${game.goals_against} ${outcome.at(0)!.toUpperCase()}`
    }
    return ""
  }, [game.goals_for, game.goals_against, outcome])

  const scoreColor = React.useMemo((): string => {
    switch (outcome) {
      case "win":
        return "green"
      case "loss":
        return "red"
      case "tie":
        return "black"
      case "unplayed":
        return "transparent"
    }
  }, [outcome])

  return (
    <ReactNative.View
      style={{ height: 44, paddingLeft, width: "100%" }}
      testID="Game List Item"
    >
      <ReactNative.View
        style={{
          flex: 1,
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "space-between",
          paddingRight: 10,
        }}
      >
        <ReactNative.View style={{ flexDirection: "row", width: 80 }}>
          <ReactNative.View>
            <ReactNative.Text>{formattedTime}</ReactNative.Text>
            <ReactNative.Text
              style={{ color: "gray", fontSize: 10, marginTop: 3 }}
            >
              {formattedDate}
            </ReactNative.Text>
          </ReactNative.View>
        </ReactNative.View>

        <ReactNative.View style={{ justifyContent: "center" }}>
          <ReactNative.Text style={{ textAlign: "center" }}>
            {game.rink}
          </ReactNative.Text>
          <ReactNative.Text
            style={{
              textAlign: "center",
              color: "gray",
              fontSize: 10,
              marginTop: 3,
            }}
          >
            {game.is_home_team ? "Home" : "Away"}
          </ReactNative.Text>
        </ReactNative.View>

        <ReactNative.View style={{ width: 80 }}>
          <ReactNative.Text
            style={{
              textAlign: "right",
              color: scoreColor,
              fontSize: 16,
            }}
          >
            {formattedScore}
          </ReactNative.Text>
          <ReactNative.Text
            style={{
              color: "gray",
              fontSize: 10,
              marginTop: 3,
              textAlign: "right",
            }}
          >
            {game.opposing_teams_name ? `v ${game.opposing_teams_name}` : ""}
          </ReactNative.Text>
        </ReactNative.View>
      </ReactNative.View>
    </ReactNative.View>
  )
}

export default GameListItem
