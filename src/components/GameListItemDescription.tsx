import React from "react"
import * as ReactNative from "react-native"
import * as DateFNS from "date-fns"
import useTheme from "hooks/useTheme"
import type { Game } from "types/Game"

interface GameListItemDescriptionProps {
  game: Game
}
const GameListItemDescription = ({
  game,
}: GameListItemDescriptionProps): React.ReactElement => {
  const theme = useTheme()

  const timeLabel = React.useMemo((): string => {
    return DateFNS.format(DateFNS.parseISO(game.played_at), "h:mm a")
  }, [game.played_at])

  return (
    <ReactNative.View style={{ justifyContent: "space-between" }}>
      <ReactNative.Text
        style={{
          fontSize: 20,
          color: theme.colors.text,
          fontWeight: "bold",
        }}
      >
        {timeLabel}
      </ReactNative.Text>
      <ReactNative.View>
        {game.opposing_teams_name && (
          <>
            <ReactNative.Text
              style={{
                fontSize: 14,
                color: theme.colors.secondaryLabel,
              }}
            >
              {game.opposing_teams_name}
            </ReactNative.Text>
          </>
        )}
        <ReactNative.Text
          style={{ fontSize: 14, color: theme.colors.secondaryLabel }}
        >
          <ReactNative.Text>{game.rink ? `${game.rink}` : ""}</ReactNative.Text>
          {game.rink && <ReactNative.Text> </ReactNative.Text>}
          <ReactNative.Text>
            {game.is_home_team ? "Home" : "Away"}
          </ReactNative.Text>
        </ReactNative.Text>
      </ReactNative.View>
    </ReactNative.View>
  )
}

export default GameListItemDescription
