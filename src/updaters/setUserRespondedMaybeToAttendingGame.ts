import type { Game as GameType } from "types/Game"
import type { RefreshableRequest } from "types/RefreshableRequest"

const setUserRespondedMaybeToAttendingGame =
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
      const gamesWithPlayerRespondingMaybeToAttending =
        refreshableGames.data.map(currentGame => {
          if (currentGame.id === game.id) {
            const idsOfPlayersWhoRespondedMaybeToAttendingWithoutDuplicates = [
              ...new Set([
                ...game.ids_of_players_who_responded_maybe_to_attending,
                userId,
              ]),
            ]
            const idsOfPlayersWhoRespondedYesToAttending =
              game.ids_of_players_who_responded_yes_to_attending.filter(
                id => id !== userId,
              )
            const idsOfPlayersWhoRespondedNoToAttending =
              game.ids_of_players_who_responded_no_to_attending.filter(
                id => id !== userId,
              )
            const gameWithPlayerRespondingMaybeToAttending = {
              ...currentGame,
              ids_of_players_who_responded_maybe_to_attending:
                idsOfPlayersWhoRespondedMaybeToAttendingWithoutDuplicates,
              ids_of_players_who_responded_yes_to_attending:
                idsOfPlayersWhoRespondedYesToAttending,
              ids_of_players_who_responded_no_to_attending:
                idsOfPlayersWhoRespondedNoToAttending,
            }
            return gameWithPlayerRespondingMaybeToAttending
          } else {
            return currentGame
          }
        })

      return {
        status: refreshableGames.status,
        data: gamesWithPlayerRespondingMaybeToAttending,
      }
    } else {
      return refreshableGames
    }
  }

export default setUserRespondedMaybeToAttendingGame
