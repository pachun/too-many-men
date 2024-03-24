import React from "react"
import * as DateFNS from "date-fns"
import type { Game as GameType } from "types/Game"
import useEffectEverySecond from "hooks/useEffectEverySecond"
import useIsSignedIn from "hooks/useIsSignedIn"

const isTheGameInTheFuture = (game: GameType): boolean => {
  const currentTime = new Date()
  const gameTime = DateFNS.parseISO(game.played_at)
  return DateFNS.isBefore(currentTime, gameTime)
}

const useShouldShowThe_AreYouGoingToThisGame_Question = (
  game: GameType | undefined,
): boolean => {
  const [theGameIsInTheFuture, setTheGameIsInTheFuture] = React.useState(
    game ? isTheGameInTheFuture(game) : false,
  )

  const updateWhetherOrNotTheGameIsInTheFuture = React.useCallback(() => {
    if (game) {
      setTheGameIsInTheFuture(isTheGameInTheFuture(game))
    }
  }, [game])

  useEffectEverySecond(updateWhetherOrNotTheGameIsInTheFuture)

  const isSignedIn = useIsSignedIn()

  const shouldShowThe_AreYouGoingToThisGame_Question = React.useMemo(
    () => theGameIsInTheFuture && isSignedIn,
    [theGameIsInTheFuture, isSignedIn],
  )

  return shouldShowThe_AreYouGoingToThisGame_Question
}

export default useShouldShowThe_AreYouGoingToThisGame_Question
