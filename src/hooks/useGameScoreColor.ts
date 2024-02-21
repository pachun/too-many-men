import React from "react"
import type { GameOutcome } from "types/GameOutcome"
import { color } from "./useTheme"

const useGameScoreColor = (gameOutcome: GameOutcome): string => {
  const nonIosScoreColor = React.useMemo((): string => {
    switch (gameOutcome) {
      case "Win":
        return "green"
      case "Loss":
        return "red"
      case "Tie":
        return "gray"
      case "Unplayed":
        return "transparent"
    }
  }, [gameOutcome])

  const iosScoreColor = React.useMemo((): string => {
    switch (gameOutcome) {
      case "Win":
        return "systemGreen"
      case "Loss":
        return "systemRed"
      case "Tie":
        return "systemGray"
      case "Unplayed":
        return "transparent"
    }
  }, [gameOutcome])

  return color({ ios: iosScoreColor, other: nonIosScoreColor })
}

export default useGameScoreColor
