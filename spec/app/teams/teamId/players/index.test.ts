import * as ERTL from "expo-router/testing-library"
import * as ReactNative from "react-native"
import playerFactory from "spec/specHelpers/factories/player"
import pullToRefresh from "spec/specHelpers/pullToRefresh"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { mockRequest } from "spec/specHelpers/mockApi"
import mockLoggedInPlayer from "spec/specHelpers/mockLoggedInPlayer"
import teamFactory from "spec/specHelpers/factories/team"

describe("viewing a team", () => {
  beforeEach(async () => {
    await AsyncStorage.clear()
  })

  it("sets the navigation bar title to Players", async () => {
    const apiToken = await mockLoggedInPlayer()
    const team = teamFactory()

    mockRequest({
      method: "get",
      path: `/teams/${team.id}/players`,
      apiToken,
      response: [],
    })

    ERTL.renderRouter("src/app", { initialUrl: `/teams/${team.id}` })

    await ERTL.waitFor(() => {
      expect(ERTL.screen).toHaveNavigationBarTitle("Players")
    })
  })

  it("shows a back button to reselect a different team", async () => {
    const apiToken = await mockLoggedInPlayer()
    const team = teamFactory()

    mockRequest({
      method: "get",
      path: `/teams/${team.id}/players`,
      apiToken,
      response: [],
    })

    ERTL.renderRouter("src/app", { initialUrl: `/teams/${team.id}` })

    if (ReactNative.Platform.OS === "ios") {
      await ERTL.waitFor(() => {
        expect(
          ERTL.within(ERTL.screen.getByTestId("Teams Back Button")),
        ).toShowText("Teams")
      })
    }

    ERTL.fireEvent.press(ERTL.screen.getByTestId("Teams Back Button"))

    await ERTL.waitFor(() => {
      expect(ERTL.screen).toHavePathname(`/teams`)
    })
  })

  describe("when players are loading", () => {
    it("shows a loading spinner", async () => {
      const apiToken = await mockLoggedInPlayer()
      const team = teamFactory()
      mockRequest({
        method: "get",
        path: `/teams/${team.id}/players`,
        apiToken,
        response: [],
      })

      ERTL.renderRouter("src/app", { initialUrl: `/teams/${team.id}` })

      await ERTL.waitFor(() => {
        expect(ERTL.screen).toShowTestId("Loading Spinner")
      })
    })
  })

  describe("when players have loaded", () => {
    it("shows players full names", async () => {
      const apiToken = await mockLoggedInPlayer()
      const team = teamFactory()
      mockRequest({
        method: "get",
        path: `/teams/${team.id}/players`,
        apiToken,
        response: [
          playerFactory({ first_name: "Jim", last_name: "Halpert" }),
          playerFactory({ first_name: "Dwight", last_name: "Schrute" }),
        ],
      })

      ERTL.renderRouter("src/app", { initialUrl: `/teams/${team.id}` })

      await ERTL.waitFor(() => {
        expect(ERTL.screen).toShowText("Jim Halpert")
        expect(ERTL.screen).toShowText("Dwight Schrute")
      })
    })

    it("orders players alphabetically by last name", async () => {
      const improperlySortedPlayers = [
        playerFactory({ first_name: "Dwight", last_name: "Schrute" }),
        playerFactory({ first_name: "Jim", last_name: "Halpert" }),
      ]
      const apiToken = await mockLoggedInPlayer()
      const team = teamFactory()
      mockRequest({
        method: "get",
        path: `/teams/${team.id}/players`,
        apiToken,
        response: improperlySortedPlayers,
      })

      ERTL.renderRouter("src/app", { initialUrl: `/teams/${team.id}` })

      await ERTL.waitFor(() => {
        expect(ERTL.screen).not.toShowTestId("Loading Spinner")
      })

      const playerListItems = ERTL.screen.getAllByTestId("Player List Item")

      expect(ERTL.within(playerListItems[0])).toShowText("Jim Halpert")
      expect(ERTL.within(playerListItems[1])).toShowText("Dwight Schrute")
    })

    it("removes the loading spinner", async () => {
      const apiToken = await mockLoggedInPlayer()
      const team = teamFactory()
      mockRequest({
        method: "get",
        path: `/teams/${team.id}/players`,
        apiToken,
        response: [],
      })

      ERTL.renderRouter("src/app", { initialUrl: `/teams/${team.id}` })

      await ERTL.waitFor(() => {
        expect(ERTL.screen).not.toShowTestId("Loading Spinner")
      })
    })

    describe("tapping a players name", () => {
      it("highlights the player list item while the tap is in progress", async () => {
        const apiToken = await mockLoggedInPlayer()
        const team = teamFactory()
        mockRequest({
          method: "get",
          path: `/teams/${team.id}/players`,
          apiToken,
          response: [
            playerFactory({ first_name: "Dwight", last_name: "Schrute" }),
          ],
        })

        ERTL.renderRouter("src/app", { initialUrl: `/teams/${team.id}` })

        await ERTL.waitFor(() => {
          expect(ERTL.screen).not.toShowTestId("Loading Spinner")
        })

        const playerListItems = ERTL.screen.getAllByTestId("Player List Item")

        ERTL.fireEvent(playerListItems[0], "pressIn")

        if (ReactNative.Platform.OS === "ios") {
          await ERTL.waitFor(() => {
            expect(playerListItems[0].props.style.backgroundColor).toEqual({
              semantic: ["tertiarySystemBackground"],
            })
          })
        } else {
          await ERTL.waitFor(() => {
            expect(playerListItems[0].props.style.backgroundColor).toEqual(
              "white",
            )
          })
        }

        ERTL.fireEvent(playerListItems[0], "pressOut")

        if (ReactNative.Platform.OS === "ios") {
          await ERTL.waitFor(() => {
            expect(playerListItems[0].props.style.backgroundColor).not.toEqual({
              semantic: ["tertiarySystemBackground"],
            })
          })
        } else {
          await ERTL.waitFor(() => {
            expect(playerListItems[0].props.style.backgroundColor).not.toEqual(
              "white",
            )
          })
        }
      })

      it("shows the player's details screen (without refetching the players details from the api)", async () => {
        const apiToken = await mockLoggedInPlayer()
        const team = teamFactory()
        const player = playerFactory({
          first_name: "Creed",
          last_name: "Bratton",
          jersey_number: 55,
          phone_number: "0123456789",
        })
        mockRequest({
          method: "get",
          path: `/teams/${team.id}/players`,
          apiToken,
          response: [player],
        })

        ERTL.renderRouter("src/app", { initialUrl: `/teams/${team.id}` })

        await ERTL.waitFor(() => {
          expect(ERTL.screen).toShowText("Creed Bratton")
        })

        ERTL.fireEvent.press(ERTL.screen.getByText("Creed Bratton"))

        await ERTL.waitFor(() => {
          expect(ERTL.screen).toHavePathname(
            `/teams/${team.id}/players/${player.id}`,
          )
          expect(ERTL.screen).toShowText("#55")
          expect(ERTL.screen).toShowText("(012) 345-6789")
        })
      })
    })
  })

  describe("when there is a network problem loading players", () => {
    it("removes the loading spinner", async () => {
      const apiToken = await mockLoggedInPlayer()
      const team = teamFactory()
      mockRequest({
        method: "get",
        path: `/teams/${team.id}/players`,
        apiToken,
        response: "Network Error",
      })

      ERTL.renderRouter("src/app", { initialUrl: `/teams/${team.id}` })

      await ERTL.waitFor(() => {
        expect(ERTL.screen).not.toShowTestId("Loading Spinner")
      })
    })

    it("shows an error message", async () => {
      const apiToken = await mockLoggedInPlayer()
      const team = teamFactory()
      mockRequest({
        method: "get",
        path: `/teams/${team.id}/players`,
        apiToken,
        response: "Network Error",
      })

      ERTL.renderRouter("src/app", { initialUrl: `/teams/${team.id}` })

      await ERTL.waitFor(() =>
        expect(ERTL.screen).toShowText("Trouble Connecting to the Internet"),
      )
    })

    describe("when the error message is tapped", () => {
      it("removes the error message", async () => {
        const apiToken = await mockLoggedInPlayer()
        const team = teamFactory()
        mockRequest({
          method: "get",
          path: `/teams/${team.id}/players`,
          apiToken,
          response: "Network Error",
        })

        ERTL.renderRouter("src/app", { initialUrl: `/teams/${team.id}` })

        await ERTL.waitFor(() =>
          expect(ERTL.screen).toShowText("Trouble Connecting to the Internet"),
        )

        ERTL.fireEvent.press(
          ERTL.screen.getByText("Trouble Connecting to the Internet"),
        )

        await ERTL.waitFor(() =>
          expect(ERTL.screen).not.toShowText(
            "Trouble Connecting to the Internet",
          ),
        )
      })
    })

    it("shows a reload button", async () => {
      const apiToken = await mockLoggedInPlayer()
      const team = teamFactory()
      mockRequest({
        method: "get",
        path: `/teams/${team.id}/players`,
        apiToken,
        response: "Network Error",
      })

      ERTL.renderRouter("src/app", { initialUrl: `/teams/${team.id}` })

      await ERTL.waitFor(() =>
        expect(ERTL.screen).toShowTestId("Reload Button"),
      )
    })

    describe("when the reload button is tapped", () => {
      it("removes the error message", async () => {
        const apiToken = await mockLoggedInPlayer()
        const team = teamFactory()
        mockRequest({
          method: "get",
          path: `/teams/${team.id}/players`,
          apiToken,
          response: "Network Error",
        })

        ERTL.renderRouter("src/app", { initialUrl: `/teams/${team.id}` })

        await ERTL.waitFor(() =>
          expect(ERTL.screen).toShowTestId("Reload Button"),
        )

        mockRequest({
          method: "get",
          path: `/teams/${team.id}/players`,
          apiToken,
        })

        ERTL.fireEvent.press(ERTL.screen.getByTestId("Reload Button"))

        await ERTL.waitFor(() =>
          expect(ERTL.screen).not.toShowText(
            "Trouble Connecting to the Internet",
          ),
        )
      })

      it("removes the reload button", async () => {
        const apiToken = await mockLoggedInPlayer()
        const team = teamFactory()
        mockRequest({
          method: "get",
          path: `/teams/${team.id}/players`,
          apiToken,
          response: "Network Error",
        })

        ERTL.renderRouter("src/app", { initialUrl: `/teams/${team.id}` })

        await ERTL.waitFor(() =>
          expect(ERTL.screen).toShowTestId("Reload Button"),
        )

        mockRequest({
          method: "get",
          path: `/teams/${team.id}/players`,
          apiToken,
        })

        ERTL.fireEvent.press(ERTL.screen.getByTestId("Reload Button"))

        await ERTL.waitFor(() =>
          expect(ERTL.screen).not.toShowTestId("Reload Button"),
        )
      })

      it("shows a loading spinner", async () => {
        const apiToken = await mockLoggedInPlayer()
        const team = teamFactory()
        mockRequest({
          method: "get",
          path: `/teams/${team.id}/players`,
          apiToken,
          response: "Network Error",
        })

        ERTL.renderRouter("src/app", { initialUrl: `/teams/${team.id}` })

        await ERTL.waitFor(() =>
          expect(ERTL.screen).toShowTestId("Reload Button"),
        )

        mockRequest({
          method: "get",
          path: `/teams/${team.id}/players`,
          apiToken,
        })

        ERTL.fireEvent.press(ERTL.screen.getByTestId("Reload Button"))

        await ERTL.waitFor(() =>
          expect(ERTL.screen).toShowTestId("Loading Spinner"),
        )
      })

      describe("when the reload finishes", () => {
        it("shows players", async () => {
          const apiToken = await mockLoggedInPlayer()
          const team = teamFactory()
          mockRequest({
            method: "get",
            path: `/teams/${team.id}/players`,
            apiToken,
            response: "Network Error",
          })

          ERTL.renderRouter("src/app", { initialUrl: `/teams/${team.id}` })

          await ERTL.waitFor(() =>
            expect(ERTL.screen).toShowTestId("Reload Button"),
          )

          mockRequest({
            method: "get",
            path: `/teams/${team.id}/players`,
            apiToken,
            response: [
              playerFactory({ first_name: "Kelly", last_name: "Kapoor" }),
            ],
          })

          ERTL.fireEvent.press(ERTL.screen.getByTestId("Reload Button"))

          await ERTL.waitFor(() =>
            expect(ERTL.screen).toShowText("Kelly Kapoor"),
          )
        })
      })
    })
  })

  describe("when the player list is pulled down", () => {
    it("shows refreshed players", async () => {
      const apiToken = await mockLoggedInPlayer()
      const team = teamFactory()
      mockRequest({
        method: "get",
        path: `/teams/${team.id}/players`,
        apiToken,
        response: [
          playerFactory({ first_name: "Jim", last_name: "Halpert" }),
          playerFactory({ first_name: "Dwight", last_name: "Schrute" }),
        ],
      })

      ERTL.renderRouter("src/app", { initialUrl: `/teams/${team.id}` })

      await ERTL.waitFor(() => {
        expect(ERTL.screen).toShowText("Jim Halpert")
        expect(ERTL.screen).toShowText("Dwight Schrute")
      })

      mockRequest({
        method: "get",
        path: `/teams/${team.id}/players`,
        apiToken,
        response: [
          playerFactory({ first_name: "Michael", last_name: "Scott" }),
          playerFactory({ first_name: "Stanley", last_name: "Hudson" }),
        ],
      })

      await pullToRefresh("Player List")

      await ERTL.waitFor(() => {
        expect(ERTL.screen).toShowText("Michael Scott")
        expect(ERTL.screen).toShowText("Stanley Hudson")
      })
    })

    describe("when there is a network problem refreshing players", () => {
      it("shows an error message", async () => {
        const apiToken = await mockLoggedInPlayer()
        const team = teamFactory()
        mockRequest({
          method: "get",
          path: `/teams/${team.id}/players`,
          apiToken,
          response: [
            playerFactory({ first_name: "Jim", last_name: "Halpert" }),
            playerFactory({ first_name: "Dwight", last_name: "Schrute" }),
          ],
        })

        ERTL.renderRouter("src/app", { initialUrl: `/teams/${team.id}` })

        await ERTL.waitFor(() => {
          expect(ERTL.screen).toShowText("Jim Halpert")
          expect(ERTL.screen).toShowText("Dwight Schrute")
        })

        mockRequest({
          method: "get",
          path: `/teams/${team.id}/players`,
          apiToken,
          response: "Network Error",
        })

        await pullToRefresh("Player List")

        await ERTL.waitFor(() => {
          expect(ERTL.screen).toShowText("Trouble Connecting to the Internet")
        })
      })

      it("keeps showing the players that were successfully fetched before the failed refresh", async () => {
        const apiToken = await mockLoggedInPlayer()
        const team = teamFactory()
        mockRequest({
          method: "get",
          path: `/teams/${team.id}/players`,
          apiToken,
          response: [
            playerFactory({ first_name: "Jim", last_name: "Halpert" }),
            playerFactory({ first_name: "Dwight", last_name: "Schrute" }),
          ],
        })

        ERTL.renderRouter("src/app", { initialUrl: `/teams/${team.id}` })

        await ERTL.waitFor(() => {
          expect(ERTL.screen).toShowText("Jim Halpert")
          expect(ERTL.screen).toShowText("Dwight Schrute")
        })

        mockRequest({
          method: "get",
          path: `/teams/${team.id}/players`,
          apiToken,
          response: "Network Error",
        })

        await pullToRefresh("Player List")

        await ERTL.waitFor(() => {
          expect(ERTL.screen).toShowText("Jim Halpert")
          expect(ERTL.screen).toShowText("Dwight Schrute")
        })
      })
    })
  })
})
