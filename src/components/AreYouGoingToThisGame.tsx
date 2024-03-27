import React from "react"
import * as ReactNative from "react-native"
import * as DateFNS from "date-fns"
import RadioButton from "components/RadioButton"
import useIsSignedIn from "hooks/useIsSignedIn"
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
import color from "helpers/color"
import useTheme from "hooks/useTheme"
import Config from "Config"
import useApiToken from "hooks/useApiToken"
import useNavigationHeaderToastNotification from "hooks/useNavigationHeaderToastNotification"

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
  const theme = useTheme()

  const { userId } = useUserId()

  const { apiToken } = useApiToken()

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

  const [isWaitingForApiResponse, setIsWaitingForApiResponse] =
    React.useState(false)

  const { showNotification } = useNavigationHeaderToastNotification()

  const updateAreYouGoingToThisGame = React.useCallback(
    async (playerAttendance: AreYouGoingToThisGameSelection) => {
      switch (playerAttendance) {
        case "Yes":
          setRefreshableGames(
            setUserRespondedYesToAttendingGame(userId!, game!),
          )
          setIsWaitingForApiResponse(true)
          try {
            await fetch(`${Config.apiUrl}/games/${game.id}/player_attendance`, {
              method: "POST",
              headers: {
                "ApiToken": apiToken!,
                "Content-Type": "Application/JSON",
              },
              body: JSON.stringify({ attending: "Yes" }),
            })
          } catch {
            showNotification({
              type: "warning",
              message: "Trouble Connecting to the Internet",
              dismissAfter: 3,
            })
          }
          setIsWaitingForApiResponse(false)
          break
        case "No":
          setRefreshableGames(setUserRespondedNoToAttendingGame(userId!, game!))
          setIsWaitingForApiResponse(true)
          await fetch(`${Config.apiUrl}/games/${game.id}/player_attendance`, {
            method: "POST",
            headers: {
              "ApiToken": apiToken!,
              "Content-Type": "Application/JSON",
            },
            body: JSON.stringify({ attending: "No" }),
          })
          setIsWaitingForApiResponse(false)
          break
        case "Maybe":
          setRefreshableGames(
            setUserRespondedMaybeToAttendingGame(userId!, game!),
          )
          setIsWaitingForApiResponse(true)
          await fetch(`${Config.apiUrl}/games/${game.id}/player_attendance`, {
            method: "POST",
            headers: {
              "ApiToken": apiToken!,
              "Content-Type": "Application/JSON",
            },
            body: JSON.stringify({ attending: "Maybe" }),
          })
          setIsWaitingForApiResponse(false)
          break
      }
    },
    [game, apiToken, userId, setRefreshableGames, showNotification],
  )

  if (shouldShowThe_AreYouGoingToThisGame_Question) {
    return (
      <ForegroundItem>
        <ReactNative.View
          style={{ flexDirection: "row", justifyContent: "space-between" }}
        >
          <AppText bold>Are you going to this game?</AppText>
          {isWaitingForApiResponse && (
            <ReactNative.ActivityIndicator
              color={theme.colors.secondaryLabel}
              testID="Mini Loading Spinner"
            />
          )}
        </ReactNative.View>
        <VerticalSpacing />
        <ReactNative.View
          style={{ flexDirection: "row", justifyContent: "space-between" }}
        >
          <RadioButton
            color={color("green")}
            label="Yes"
            disabled={isWaitingForApiResponse}
            selected={areYouGoingToThisGameAnswer === "Yes"}
            onPress={() => updateAreYouGoingToThisGame("Yes")}
          />
          <RadioButton
            color={color("red")}
            label="No"
            disabled={isWaitingForApiResponse}
            selected={areYouGoingToThisGameAnswer === "No"}
            onPress={() => updateAreYouGoingToThisGame("No")}
          />
          <RadioButton
            color={color("yellow")}
            label="Maybe"
            disabled={isWaitingForApiResponse}
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
