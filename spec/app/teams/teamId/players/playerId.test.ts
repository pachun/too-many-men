import * as ERTL from "expo-router/testing-library"
import AsyncStorage from "@react-native-async-storage/async-storage"
import playerFactory from "spec/specHelpers/factories/player"
import { mockRequest } from "spec/specHelpers/mockApi"
import teamFactory from "spec/specHelpers/factories/team"
import mockLoggedInPlayer from "spec/specHelpers/mockLoggedInPlayer"
import { unstable_settings } from "app/teams/[teamId]/players/_layout"
import type { Team } from "types/Team"
import type { UnstableSettings } from "types/UnstableSettings"

const mockGetPlayersToKeepBackButtonsWorkingAfterDeepLink = ({
  apiToken,
  team,
  unstable_settings:
    _unusedButCalledOutHereToShowTheNeedForTheMockInThisFunction,
}: {
  apiToken: string
  team: Team
  unstable_settings: UnstableSettings
}): void => {
  mockRequest({
    apiToken,
    method: "get",
    path: `/teams/${team.id}/players`,
    response: [],
  })
}

describe("viewing a player", () => {
  afterEach(async () => {
    await AsyncStorage.clear()
  })

  describe("while the player is loaded from the api", () => {
    it("shows a loading spinner", async () => {
      const player = playerFactory()
      const apiToken = await mockLoggedInPlayer(player)
      const team = teamFactory()
      mockRequest({
        apiToken,
        method: "get",
        path: `/teams/${team.id}/players/${player.id}`,
        response: player,
      })

      ERTL.renderRouter("src/app", {
        initialUrl: `/teams/${team.id}/players/${player.id}`,
      })

      await ERTL.waitFor(() => {
        expect(ERTL.screen).toShowTestId("Loading Spinner")
      })
    })

    it("does not show a navigation bar title", async () => {
      const player = playerFactory()
      const apiToken = await mockLoggedInPlayer(player)
      const team = teamFactory()
      mockGetPlayersToKeepBackButtonsWorkingAfterDeepLink({
        apiToken,
        team,
        unstable_settings,
      })
      mockRequest({
        apiToken,
        method: "get",
        path: `/teams/${team.id}/players/${player.id}`,
        response: player,
      })

      ERTL.renderRouter("src/app", {
        initialUrl: `/teams/${team.id}/players/${player.id}`,
      })

      await ERTL.waitFor(() => {
        expect(ERTL.screen).toHaveNavigationBarTitle({
          title: "",
          nestedNavigationBarIndex: 1,
        })
      })
    })
  })

  describe("when the player is done loading from the api", () => {
    it("hides the loading spinner", async () => {
      const player = playerFactory()
      const apiToken = await mockLoggedInPlayer(player)
      const team = teamFactory()
      mockGetPlayersToKeepBackButtonsWorkingAfterDeepLink({
        apiToken,
        team,
        unstable_settings,
      })
      mockRequest({
        apiToken,
        method: "get",
        path: `/teams/${team.id}/players/${player.id}`,
        response: player,
      })

      ERTL.renderRouter("src/app", {
        initialUrl: `/teams/${team.id}/players/${player.id}`,
      })

      await ERTL.waitFor(() => {
        expect(ERTL.screen).not.toShowTestId("Loading Spinner")
      })
    })

    it("sets the navigation bar title to the player's name", async () => {
      const player = playerFactory({
        first_name: "Jim",
        last_name: "Halpert",
      })
      const apiToken = await mockLoggedInPlayer(player)
      const team = teamFactory()
      mockGetPlayersToKeepBackButtonsWorkingAfterDeepLink({
        apiToken,
        team,
        unstable_settings,
      })
      mockRequest({
        apiToken,
        method: "get",
        path: `/teams/${team.id}/players/${player.id}`,
        response: player,
      })

      ERTL.renderRouter("src/app", {
        initialUrl: `/teams/${team.id}/players/${player.id}`,
      })

      await ERTL.waitFor(() => {
        expect(ERTL.screen).toHaveNavigationBarTitle({
          title: "Jim Halpert",
          nestedNavigationBarIndex: 1,
        })
      })
    })

    it("shows the players phone number", async () => {
      const player = playerFactory({ phone_number: "0123456789" })
      const apiToken = await mockLoggedInPlayer(player)
      const team = teamFactory()
      mockGetPlayersToKeepBackButtonsWorkingAfterDeepLink({
        apiToken,
        team,
        unstable_settings,
      })
      mockRequest({
        apiToken,
        method: "get",
        path: `/teams/${team.id}/players/${player.id}`,
        response: player,
      })

      ERTL.renderRouter("src/app", {
        initialUrl: `/teams/${team.id}/players/${player.id}`,
      })

      await ERTL.waitFor(() => {
        expect(ERTL.screen).toShowText("(012) 345-6789")
      })
    })

    it("shows the players jersey number", async () => {
      const player = playerFactory({ jersey_number: 12 })
      const apiToken = await mockLoggedInPlayer(player)
      const team = teamFactory()
      mockGetPlayersToKeepBackButtonsWorkingAfterDeepLink({
        apiToken,
        team,
        unstable_settings,
      })
      mockRequest({
        apiToken,
        method: "get",
        path: `/teams/${team.id}/players/${player.id}`,
        response: player,
      })

      ERTL.renderRouter("src/app", {
        initialUrl: `/teams/${team.id}/players/${player.id}`,
      })

      await ERTL.waitFor(() => {
        expect(ERTL.screen).toShowText("#12")
      })
    })
  })
})
