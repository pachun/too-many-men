import React from "react"
import * as ReactNative from "react-native"
import * as DateFNS from "date-fns"
import RadioButton from "components/RadioButton"
import useIsSignedIn from "hooks/useIsSignedIn"
import useRefreshableGames from "hooks/useRefreshableGames"
import useEffectEverySecond from "hooks/useEffectEverySecond"
import type { Game } from "types/Game"
import useUserId from "hooks/useUserId"
import ForegroundItem from "./ForegroundItem"
import AppText from "components/AppText"
import VerticalSpacing from "./VerticalSpacing"
import useTheme from "hooks/useTheme"
import Config from "Config"
import useApiToken from "hooks/useApiToken"
import useNavigationHeaderToastNotification from "hooks/useNavigationHeaderToastNotification"
import setUsersResponseToAttendingGame from "updaters/setUsersResponseToAttendingGame"
import type { UsersResponseToAttendingGame } from "types/UsersResponseToAttendingGame"
import getUsersResponseToAttendingGame from "selectors/getUsersResponseToAttendingGame"

const isTheGameInTheFuture = (game: Game): boolean => {
  const currentTime = new Date()
  const gameTime = DateFNS.parseISO(game.played_at)
  return DateFNS.isBefore(currentTime, gameTime)
}

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

  const usersResponseToAttendingGame = React.useMemo(() => {
    return getUsersResponseToAttendingGame(userId!, game)
  }, [userId, game])

  const [isWaitingForApiResponse, setIsWaitingForApiResponse] =
    React.useState(false)

  const { showNotification } = useNavigationHeaderToastNotification()

  const updateUsersResponseToAttendingGame = React.useCallback(
    async (
      usersResponseToAttendingGame: UsersResponseToAttendingGame,
    ): Promise<void> => {
      const usersPreviousResponseToAttendingGame =
        getUsersResponseToAttendingGame(userId!, game)
      if (
        usersPreviousResponseToAttendingGame !== usersResponseToAttendingGame
      ) {
        setRefreshableGames(
          setUsersResponseToAttendingGame(
            userId!,
            game,
            usersResponseToAttendingGame,
          ),
        )
        setIsWaitingForApiResponse(true)
        try {
          await fetch(`${Config.apiUrl}/games/${game.id}/player_attendance`, {
            method: "POST",
            headers: {
              "ApiToken": apiToken!,
              "Content-Type": "Application/JSON",
            },
            body: JSON.stringify({ attending: usersResponseToAttendingGame }),
          })
        } catch {
          setRefreshableGames(
            setUsersResponseToAttendingGame(
              userId!,
              game,
              usersPreviousResponseToAttendingGame,
            ),
          )
          showNotification({
            type: "warning",
            message: "Trouble Connecting to the Internet",
            dismissAfter: 3,
          })
        }
        setIsWaitingForApiResponse(false)
      }
    },
    [apiToken, game, userId, setRefreshableGames, showNotification],
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
            color={theme.colors.gameAttendanceButtonBackgroundColor.going}
            label="Yes"
            disabled={isWaitingForApiResponse}
            selected={usersResponseToAttendingGame === "Yes"}
            onPress={() => updateUsersResponseToAttendingGame("Yes")}
          />
          <RadioButton
            color={theme.colors.gameAttendanceButtonBackgroundColor.notGoing}
            label="No"
            disabled={isWaitingForApiResponse}
            selected={usersResponseToAttendingGame === "No"}
            onPress={() => updateUsersResponseToAttendingGame("No")}
          />
          <RadioButton
            color={theme.colors.gameAttendanceButtonBackgroundColor.maybeGoing}
            label="Maybe"
            disabled={isWaitingForApiResponse}
            selected={usersResponseToAttendingGame === "Maybe"}
            onPress={() => updateUsersResponseToAttendingGame("Maybe")}
          />
        </ReactNative.View>
      </ForegroundItem>
    )
  } else {
    return <></>
  }
}

export default AreYouGoingToThisGame
