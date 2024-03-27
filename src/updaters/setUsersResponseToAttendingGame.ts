import type { Game } from "types/Game"
import type {
  RefreshableRequest,
  RefreshableRequestWithData,
} from "types/RefreshableRequest"

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
    return [...existingUserIds, newUserId]
  } else {
    return existingUserIds.filter(currentUserId => currentUserId !== newUserId)
  }
}

const setUsersResponseToAttendingGame =
  (
    userId: number,
    game: Game,
    response: "Yes" | "No" | "Maybe" | "Unanswered",
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
          return {
            ...game,
            ids_of_players_who_responded_yes_to_attending: updateUserIds({
              existingUserIds: yesUserIds,
              newUserId: userId,
              shouldAddUserId: response === "Yes",
            }),
            ids_of_players_who_responded_no_to_attending: updateUserIds({
              existingUserIds: noUserIds,
              newUserId: userId,
              shouldAddUserId: response === "No",
            }),
          }
        } else {
          return currentGame
        }
      },
    )

    return { status: refreshableGames.status, data: gamesWithUpdatedAttendance }
  }

export default setUsersResponseToAttendingGame
