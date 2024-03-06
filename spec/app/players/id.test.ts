import * as ERTL from "expo-router/testing-library"
import playerFactory from "../../specHelpers/factories/player"
import mockPlayerFromApi from "../../specHelpers/mockPlayerFromApi"

describe("viewing a player", () => {
  it("sets the navigation bar title to the player's name", async () => {
    const jimHalpert = playerFactory({
      id: 1,
      first_name: "Jim",
      last_name: "Halpert",
    })

    await mockPlayerFromApi({
      playerId: 1,
      response: jimHalpert,
      test: async () => {
        ERTL.renderRouter("src/app", { initialUrl: "/players/1" })

        await ERTL.waitFor(() => {
          expect(ERTL.screen).toHaveNavigationBarTitle("Jim Halpert")
        })
      },
    })
  })

  it("shows the players phone number", async () => {
    const jimHalpert = playerFactory({
      id: 2,
      phone_number: "0123456789",
    })

    await mockPlayerFromApi({
      playerId: 2,
      response: jimHalpert,
      test: async () => {
        ERTL.renderRouter("src/app", { initialUrl: "/players/2" })

        await ERTL.waitFor(() => {
          expect(ERTL.screen).toShowText("(012) 345 6789")
        })
      },
    })
  })

  it("shows the players jersey number", async () => {
    const jimHalpert = playerFactory({
      id: 3,
      jersey_number: 12,
    })

    await mockPlayerFromApi({
      playerId: 3,
      response: jimHalpert,
      test: async () => {
        ERTL.renderRouter("src/app", { initialUrl: "/players/3" })

        await ERTL.waitFor(() => {
          expect(ERTL.screen).toShowText("#12")
        })
      },
    })
  })
})
