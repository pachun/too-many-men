import * as ERTL from "expo-router/testing-library"
import * as DateFNS from "date-fns"
import AsyncStorage from "@react-native-async-storage/async-storage"
import gameFactory from "../../specHelpers/factories/game"
import mockGameFromApi from "../../specHelpers/mockGameFromApi"
import type { Game } from "types/Game"

const gameDateWithWeekday = (game: Game): string =>
  DateFNS.format(DateFNS.parseISO(game.played_at), "EEEE, MMM d")

describe("viewing a game", () => {
  describe("while the game is loaded from the api", () => {
    it("shows a loading spinner", async () => {
      const game = gameFactory({ id: 1 })

      await mockGameFromApi({
        gameId: 1,
        response: game,
        test: async () => {
          ERTL.renderRouter("src/app", { initialUrl: "/games/1" })

          await ERTL.waitFor(() => {
            expect(ERTL.screen).toShowTestId("Loading Spinner")
          })
        },
      })
    })

    it("does not show a navigation bar title", async () => {
      const game = gameFactory({ id: 1 })

      await mockGameFromApi({
        gameId: 1,
        response: game,
        test: async () => {
          ERTL.renderRouter("src/app", { initialUrl: "/games/1" })

          await ERTL.waitFor(() => {
            expect(ERTL.screen).toHaveNavigationBarTitle("")
          })
        },
      })
    })
  })

  describe("when the game is done loading from the api", () => {
    it("hides the loading spinner", async () => {
      const game = gameFactory({ id: 1 })

      await mockGameFromApi({
        gameId: 1,
        response: game,
        test: async () => {
          ERTL.renderRouter("src/app", { initialUrl: "/games/1" })

          await ERTL.waitFor(() => {
            expect(ERTL.screen).not.toShowTestId("Loading Spinner")
          })
        },
      })
    })

    it("sets the navigation bar title to the game's date", async () => {
      const game = gameFactory({
        id: 1,
        played_at: "2024-02-09T02:30:00Z",
      })

      await mockGameFromApi({
        gameId: 1,
        response: game,
        test: async () => {
          ERTL.renderRouter("src/app", { initialUrl: "/games/1" })

          await ERTL.waitFor(() => {
            expect(ERTL.screen).toHaveNavigationBarTitle(
              gameDateWithWeekday(game),
            )
          })
        },
      })
    })

    it("shows the games date", async () => {
      const game = gameFactory({
        id: 2,
        played_at: "2024-02-09T02:30:00Z",
      })

      await mockGameFromApi({
        gameId: 2,
        response: game,
        test: async () => {
          ERTL.renderRouter("src/app", { initialUrl: "/games/2" })

          await ERTL.waitFor(() => {
            expect(ERTL.screen).toShowText("Thursday, Feb 8")
          })
        },
      })
    })

    it("shows the games time", async () => {
      const game = gameFactory({
        id: 3,
        played_at: "2024-02-09T02:30:00Z",
      })

      await mockGameFromApi({
        gameId: 3,
        response: game,
        test: async () => {
          ERTL.renderRouter("src/app", { initialUrl: "/games/3" })

          await ERTL.waitFor(() => {
            expect(ERTL.screen).toShowText("9:30 PM")
          })
        },
      })
    })

    it("shows the games rink", async () => {
      const game = gameFactory({
        id: 3,
        rink: "Rink C",
      })

      await mockGameFromApi({
        gameId: 3,
        response: game,
        test: async () => {
          ERTL.renderRouter("src/app", { initialUrl: "/games/3" })

          await ERTL.waitFor(() => {
            expect(ERTL.screen).toShowText("Rink C")
          })
        },
      })
    })

    it("shows the games opponent", async () => {
      const game = gameFactory({
        id: 3,
        opposing_teams_name: "Scott's Tots",
      })

      await mockGameFromApi({
        gameId: 3,
        response: game,
        test: async () => {
          ERTL.renderRouter("src/app", { initialUrl: "/games/3" })

          await ERTL.waitFor(() => {
            expect(ERTL.screen).toShowText("Scott's Tots")
          })
        },
      })
    })

    it("indicates when the team is the home team", async () => {
      const game = gameFactory({
        id: 3,
        is_home_team: true,
      })

      await mockGameFromApi({
        gameId: 3,
        response: game,
        test: async () => {
          ERTL.renderRouter("src/app", { initialUrl: "/games/3" })

          await ERTL.waitFor(() => {
            expect(ERTL.screen).toShowText("Home")
          })
        },
      })
    })

    it("indicates when the team is the away team", async () => {
      const game = gameFactory({
        id: 3,
        is_home_team: false,
      })

      await mockGameFromApi({
        gameId: 3,
        response: game,
        test: async () => {
          ERTL.renderRouter("src/app", { initialUrl: "/games/3" })

          await ERTL.waitFor(() => {
            expect(ERTL.screen).toShowText("Away")
          })
        },
      })
    })

    describe("when the game is in the future and the player is authenticated", () => {
      it("shows an Are You Going To This Game? question with Yes, No, and Maybe options", async () => {
        await AsyncStorage.setItem("API Token", "Faked API Token")

        const game = gameFactory({
          id: 3,
          played_at: DateFNS.addMinutes(new Date(), 1),
        })

        await mockGameFromApi({
          gameId: 3,
          response: game,
          test: async () => {
            ERTL.renderRouter("src/app", { initialUrl: "/games/3" })

            await ERTL.waitFor(() => {
              expect(ERTL.screen).toShowText("Are you going to this game?")
              expect(ERTL.screen).toShowText("Yes")
              expect(ERTL.screen).toShowText("No")
              expect(ERTL.screen).toShowText("Maybe")
            })
          },
        })
      })
    })

    describe("when the game has already started or is in the past", () => {
      it("does not show an Are You Going To This Game? question with Yes, No, and Maybe options", async () => {
        await AsyncStorage.setItem("API Token", "Faked API Token")

        const game = gameFactory({
          id: 3,
          played_at: DateFNS.addMinutes(new Date(), -1),
        })

        await mockGameFromApi({
          gameId: 3,
          response: game,
          test: async () => {
            ERTL.renderRouter("src/app", { initialUrl: "/games/3" })

            await ERTL.waitFor(() => {
              expect(ERTL.screen).not.toShowText("Are you going to this game?")
              expect(ERTL.screen).not.toShowText("Yes")
              expect(ERTL.screen).not.toShowText("No")
              expect(ERTL.screen).not.toShowText("Maybe")
            })
          },
        })
      })
    })
  })
})
