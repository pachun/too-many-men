import type { Game } from "types/Game"
import type { UsersResponseToAttendingGame } from "types/UsersResponseToAttendingGame"

const getUsersResponseToAttendingGame = (
  userId: number,
  game: Game,
): UsersResponseToAttendingGame => {
  if (game.ids_of_players_who_responded_yes_to_attending.includes(userId)) {
    return "Yes"
  } else if (
    game.ids_of_players_who_responded_no_to_attending.includes(userId)
  ) {
    return "No"
  } else if (
    game.ids_of_players_who_responded_maybe_to_attending.includes(userId)
  ) {
    return "Maybe"
  } else {
    return "Unanswered"
  }
}

export default getUsersResponseToAttendingGame
