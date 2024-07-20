import AsyncStorage from "@react-native-async-storage/async-storage"
import * as ERTL from "expo-router/testing-library"
import { mockRequest } from "spec/specHelpers/mockApi"
import mockLoggedInPlayer from "spec/specHelpers/mockLoggedInPlayer"

describe("opening the app when already authenticated", () => {
  afterEach(async () => {
    await AsyncStorage.clear()
  })

  it("redirects to the teams list screen", async () => {
    const apiToken = await mockLoggedInPlayer()

    mockRequest({
      method: "get",
      path: "/teams",
      apiToken,
      response: [],
    })

    ERTL.renderRouter("src/app", { initialUrl: "/" })

    ERTL.waitFor(async () => {
      expect(ERTL.screen).toHavePathname("/teams")
    })
  })
})
