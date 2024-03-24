import type { Game as GameType } from "types/Game"
import type { RefreshableRequest } from "types/RefreshableRequest"

const setUserRespondedNoToAttendingGame =
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
      const gamesWithPlayerRespondingNoToAttending = refreshableGames.data.map(
        currentGame => {
          if (currentGame.id === game.id) {
            const idsOfPlayersWhoRespondedNoToAttendingWithoutDuplicates = [
              ...new Set([
                ...game.ids_of_players_who_responded_no_to_attending,
                userId,
              ]),
            ]
            const gameWithPlayerRespondingNoToAttending = {
              ...currentGame,
              ids_of_players_who_responded_no_to_attending:
                idsOfPlayersWhoRespondedNoToAttendingWithoutDuplicates,
            }
            return gameWithPlayerRespondingNoToAttending
          } else {
            return currentGame
          }
        },
      )

      return {
        status: refreshableGames.status,
        data: gamesWithPlayerRespondingNoToAttending,
      }
    } else {
      return refreshableGames
    }
  }

export default setUserRespondedNoToAttendingGame
