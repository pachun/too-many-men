import type { Game as GameType } from "types/Game"
import type {
  RefreshableRequest,
  RefreshableRequestWithData,
} from "types/RefreshableRequest"

const setUserRespondedYesToAttendingGame =
  (userId: number, game: GameType) =>
  (
    refreshableGamesWithData: RefreshableRequest<GameType[]>,
  ): RefreshableRequest<GameType[]> => {
    const refreshableGames =
      refreshableGamesWithData as RefreshableRequestWithData<GameType[]>

    const gamesWithPlayerRespondingYesToAttending = refreshableGames.data.map(
      currentGame => {
        if (currentGame.id === game.id) {
          const idsOfPlayersWhoRespondedYesToAttendingWithoutDuplicates = [
            ...new Set([
              ...game.ids_of_players_who_responded_yes_to_attending,
              userId,
            ]),
          ]
          const idsOfPlayersWhoRespondedNoToAttending =
            game.ids_of_players_who_responded_no_to_attending.filter(
              id => id !== userId,
            )
          const idsOfPlayersWhoRespondedMaybeToAttending =
            game.ids_of_players_who_responded_maybe_to_attending.filter(
              id => id !== userId,
            )
          const gameWithPlayerRespondingYesToAttending = {
            ...currentGame,
            ids_of_players_who_responded_yes_to_attending:
              idsOfPlayersWhoRespondedYesToAttendingWithoutDuplicates,
            ids_of_players_who_responded_no_to_attending:
              idsOfPlayersWhoRespondedNoToAttending,
            ids_of_players_who_responded_maybe_to_attending:
              idsOfPlayersWhoRespondedMaybeToAttending,
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
  }

export default setUserRespondedYesToAttendingGame
