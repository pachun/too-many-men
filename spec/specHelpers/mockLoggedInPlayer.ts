import AsyncStorage from "@react-native-async-storage/async-storage"

interface MockLoggedInPlayerArguments {
  playerId?: number
  playerApiToken?: string
}

const mockLoggedInPlayer = async ({
  playerId = 1,
  playerApiToken = "Mocked API Token",
}: MockLoggedInPlayerArguments): Promise<{
  playerId: number
  playerApiToken: string
}> => {
  await AsyncStorage.setItem("User ID", playerId.toString())
  await AsyncStorage.setItem("API Token", playerApiToken)
  return {
    playerId,
    playerApiToken,
  }
}

export default mockLoggedInPlayer
