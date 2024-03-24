import type { Game as GameType } from "types/Game"
import type { RefreshableRequest } from "types/RefreshableRequest"

const setUserIsAttendingGame =
  (userId: number | null, game: GameType | undefined) =>
  (
    refreshableGames: RefreshableRequest<GameType[]>,
  ): RefreshableRequest<GameType[]> => {
    if (
      userId &&
      game &&
      (refreshableGames.status === "Success" ||
        refreshableGames.status === "Refreshing" ||
        refreshableGames.status === "Refresh Error")
    ) {
      const gamesWithPlayerRespondingYesToAttending = refreshableGames.data.map(
        currentGame => {
          if (currentGame.id === game.id) {
            const idsOfPlayersWhoRespondedYesToAttendingWithoutDuplicates = [
              ...new Set([
                ...game.ids_of_players_who_responded_yes_to_attending,
                userId,
              ]),
            ]
            const gameWithPlayerRespondingYesToAttending = {
              ...currentGame,
              ids_of_players_who_responded_yes_to_attending:
                idsOfPlayersWhoRespondedYesToAttendingWithoutDuplicates,
            }
            return gameWithPlayerRespondingYesToAttending
          } else {
            return currentGame
          }
        },
      )

      return {
        status: refreshableGames.status,
        data: gamesWithPlayerRespondingYesToAttending,
      }
    } else {
      return refreshableGames
    }
  }

export default setUserIsAttendingGame
