import * as ERTL from "expo-router/testing-library"
import playerFactory from "../../specHelpers/factories/player"
import mockPlayerFromApi from "../../specHelpers/mockPlayerFromApi"

describe("viewing a player", () => {
  it("sets the navigation bar title to the player's name", async () => {
    const jimHalpert = playerFactory({
      id: 5,
      first_name: "Jim",
      last_name: "Halpert",
      jersey_number: 88,
      phone_number: "0123456789",
    })

    await mockPlayerFromApi({
      playerId: jimHalpert.id,
      response: jimHalpert,
      test: async () => {
        ERTL.renderRouter("src/app", { initialUrl: "/players/5" })

        await ERTL.waitFor(() => {
          expect(ERTL.screen).toHaveNavigationBarTitle("Jim Halpert")
          expect(ERTL.screen).toShowText("88")
          expect(ERTL.screen).toShowText("(012) 345 6789")
        })
      },
    })
  })
})
