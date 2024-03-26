import React from "react"
import * as ReactNative from "react-native"
import * as DateFNS from "date-fns"
import RadioButton from "components/RadioButton"
import useIsSignedIn from "hooks/useIsSignedIn"
import { color } from "hooks/useTheme" // put color in its own helper file AppPlatformColor or something
import useRefreshableGames from "hooks/useRefreshableGames"
import useEffectEverySecond from "hooks/useEffectEverySecond"
import setUserRespondedYesToAttendingGame from "updaters/setUserRespondedYesToAttendingGame"
import setUserRespondedNoToAttendingGame from "updaters/setUserRespondedNoToAttendingGame"
import setUserRespondedMaybeToAttendingGame from "updaters/setUserRespondedMaybeToAttendingGame"
import type { Game } from "types/Game"
import useUserId from "hooks/useUserId"
import ForegroundItem from "./ForegroundItem"
import AppText from "./AppText"
import VerticalSpacing from "./VerticalSpacing"

const isTheGameInTheFuture = (game: Game): boolean => {
  const currentTime = new Date()
  const gameTime = DateFNS.parseISO(game.played_at)
  return DateFNS.isBefore(currentTime, gameTime)
}

type AreYouGoingToThisGameSelection = "Yes" | "No" | "Maybe"
type PossibleAreYouGoingToThisGameValues =
  | AreYouGoingToThisGameSelection
  | undefined

interface AreYouGoingToThisGameProps {
  game: Game
}

const AreYouGoingToThisGame = ({
  game,
}: AreYouGoingToThisGameProps): React.ReactElement => {
  const { userId } = useUserId()

  const [theGameIsInTheFuture, setTheGameIsInTheFuture] = React.useState(
    isTheGameInTheFuture(game),
  )

  const updateWhetherOrNotTheGameIsInTheFuture = React.useCallback(() => {
    setTheGameIsInTheFuture(isTheGameInTheFuture(game))
  }, [game])

  useEffectEverySecond(updateWhetherOrNotTheGameIsInTheFuture)

  const isSignedIn = useIsSignedIn()

  const shouldShowThe_AreYouGoingToThisGame_Question = React.useMemo(
    () => theGameIsInTheFuture && isSignedIn,
    [theGameIsInTheFuture, isSignedIn],
  )

  const { setRefreshableGames } = useRefreshableGames()

  const areYouGoingToThisGameAnswer =
    React.useMemo((): PossibleAreYouGoingToThisGameValues => {
      if (
        userId &&
        game.ids_of_players_who_responded_yes_to_attending.includes(userId)
      ) {
        return "Yes"
      } else if (
        userId &&
        game.ids_of_players_who_responded_no_to_attending.includes(userId)
      ) {
        return "No"
      } else if (
        userId &&
        game.ids_of_players_who_responded_maybe_to_attending.includes(userId)
      ) {
        return "Maybe"
      }
      return undefined
    }, [
      userId,
      game.ids_of_players_who_responded_yes_to_attending,
      game.ids_of_players_who_responded_no_to_attending,
      game.ids_of_players_who_responded_maybe_to_attending,
    ])

  const updateAreYouGoingToThisGame = React.useCallback(
    (playerAttendance: AreYouGoingToThisGameSelection) => {
      switch (playerAttendance) {
        case "Yes":
          setRefreshableGames(
            setUserRespondedYesToAttendingGame(userId!, game!),
          )
          break
        case "No":
          setRefreshableGames(setUserRespondedNoToAttendingGame(userId!, game!))
          break
        case "Maybe":
          setRefreshableGames(
            setUserRespondedMaybeToAttendingGame(userId!, game!),
          )
          break
      }
    },
    [game, userId, setRefreshableGames],
  )

  if (shouldShowThe_AreYouGoingToThisGame_Question) {
    return (
      <ForegroundItem>
        <AppText bold>Are you going to this game?</AppText>
        <VerticalSpacing />
        <ReactNative.View
          style={{ flexDirection: "row", justifyContent: "space-between" }}
        >
          <RadioButton
            color={color({ ios: "systemGreen", other: "green" })}
            label="Yes"
            selected={areYouGoingToThisGameAnswer === "Yes"}
            onPress={() => updateAreYouGoingToThisGame("Yes")}
          />
          <RadioButton
            color={color({ ios: "systemRed", other: "red" })}
            label="No"
            selected={areYouGoingToThisGameAnswer === "No"}
            onPress={() => updateAreYouGoingToThisGame("No")}
          />
          <RadioButton
            color={color({ ios: "systemYellow", other: "yellow" })}
            label="Maybe"
            selected={areYouGoingToThisGameAnswer === "Maybe"}
            onPress={() => updateAreYouGoingToThisGame("Maybe")}
          />
        </ReactNative.View>
      </ForegroundItem>
    )
  } else {
    return <></>
  }
}

export default AreYouGoingToThisGame
