import AsyncStorage from "@react-native-async-storage/async-storage"
import type { Player } from "types/Player"
import playerFactory from "./factories/player"

const generateRandomApiToken = (): string => {
  const apiTokenLength = 32
  const alphanumericCharacterSet =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  return " "
    .repeat(apiTokenLength)
    .split("")
    .reduce(
      apiToken =>
        apiToken +
        alphanumericCharacterSet.charAt(
          Math.floor(Math.random() * alphanumericCharacterSet.length),
        ),
      "",
    )
}

const mockLoggedInPlayer = async (
  player: Player | undefined = playerFactory(),
): Promise<string> => {
  const apiToken = generateRandomApiToken()
  await AsyncStorage.setItem("User ID", player.id.toString())
  await AsyncStorage.setItem("API Token", apiToken)

  return apiToken
}

export default mockLoggedInPlayer
