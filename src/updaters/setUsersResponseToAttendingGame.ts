import type { Game } from "types/Game"
import type {
  RefreshableRequest,
  RefreshableRequestWithData,
} from "types/RefreshableRequest"
import type { UsersResponseToAttendingGame } from "types/UsersResponseToAttendingGame"

const updateUserIds = ({
  existingUserIds,
  newUserId,
  shouldAddUserId,
}: {
  existingUserIds: number[]
  newUserId: number
  shouldAddUserId: boolean
}): number[] => {
  if (shouldAddUserId) {
    return [...new Set([...existingUserIds, newUserId])]
  } else {
    return existingUserIds.filter(currentUserId => currentUserId !== newUserId)
  }
}

const setUsersResponseToAttendingGame =
  (
    userId: number,
    game: Game,
    usersResponseToAttendingGame: UsersResponseToAttendingGame,
  ) =>
  (
    refreshableGamesWithData: RefreshableRequest<Game[]>,
  ): RefreshableRequest<Game[]> => {
    const refreshableGames =
      refreshableGamesWithData as RefreshableRequestWithData<Game[]>

    const gamesWithUpdatedAttendance = refreshableGames.data.map(
      currentGame => {
        if (currentGame.id === game.id) {
          const yesUserIds = game.ids_of_players_who_responded_yes_to_attending
          const noUserIds = game.ids_of_players_who_responded_no_to_attending
          const maybeUserIds = game.ids_of_players_who_responded_no_to_attending
          return {
            ...game,
            ids_of_players_who_responded_yes_to_attending: updateUserIds({
              existingUserIds: yesUserIds,
              newUserId: userId,
              shouldAddUserId: usersResponseToAttendingGame === "Yes",
            }),
            ids_of_players_who_responded_no_to_attending: updateUserIds({
              existingUserIds: noUserIds,
              newUserId: userId,
              shouldAddUserId: usersResponseToAttendingGame === "No",
            }),
            ids_of_players_who_responded_maybe_to_attending: updateUserIds({
              existingUserIds: maybeUserIds,
              newUserId: userId,
              shouldAddUserId: usersResponseToAttendingGame === "Maybe",
            }),
          }
        } else {
          return currentGame
        }
      },
    )

    return {
      type: "With Data",
      status: refreshableGames.status,
      data: gamesWithUpdatedAttendance,
    }
  }

export default setUsersResponseToAttendingGame
