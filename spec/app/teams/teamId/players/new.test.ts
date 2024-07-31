import * as ERTL from "expo-router/testing-library"
import teamFactory from "spec/specHelpers/factories/team"
import { mockRequest } from "spec/specHelpers/mockApi"
import mockGetPlayersToKeepBackButtonsWorkingAfterDeepLink from "spec/specHelpers/mockGetPlayersToKeepBackButtonsWorkingAfterDeepLink"
import mockLoggedInPlayer from "spec/specHelpers/mockLoggedInPlayer"
import { unstable_settings } from "app/teams/[teamId]/players/_layout"
import type { Team } from "types/Team"
import typeIntoTestId from "spec/specHelpers/typeIntoTestId"
import type { Player } from "types/Player"
import playerFactory from "spec/specHelpers/factories/player"
import AsyncStorage from "@react-native-async-storage/async-storage"
import nock from "nock"

const setupNetworkMocks = async (args: {
  team: Team
  players?: Player[]
}): Promise<string> => {
  const { team } = args
  const apiToken = await mockLoggedInPlayer()
  mockGetPlayersToKeepBackButtonsWorkingAfterDeepLink({
    apiToken,
    team,
    response: args.players || [],
    unstable_settings,
  })
  mockRequest({
    method: "get",
    path: `/teams/${team.id}`,
    response: team,
    apiToken,
  })

  return apiToken
}

describe("The Add Player Screen", () => {
  beforeEach(async () => {
    await AsyncStorage.clear()
  })

  it("shows an [TeamName] Invite header", async () => {
    const team = teamFactory({ name: "Scott's Tots" })
    setupNetworkMocks({ team })

    ERTL.renderRouter("src/app", {
      initialUrl: `/teams/${team.id}/players/new`,
    })

    await ERTL.waitFor(() => {
      expect(ERTL.screen).toHaveNavigationBarTitle({
        title: "Scott's Tots Invite",
        nestedNavigationBarIndex: 1,
      })
    })
  })

  it("shows an prompt to enter the invitees first name", async () => {
    const team = teamFactory()
    await setupNetworkMocks({ team })

    ERTL.renderRouter("src/app", {
      initialUrl: `/teams/${team.id}/players/new`,
    })

    await ERTL.waitFor(() => {
      expect(ERTL.screen.getByPlaceholderText("First Name"))
      expect(
        ERTL.screen.getByPlaceholderText("First Name").props.enterKeyHint,
      ).toEqual("next")
    })
  })

  it("shows an prompt to enter the invitees last name", async () => {
    const team = teamFactory()
    await setupNetworkMocks({ team })

    ERTL.renderRouter("src/app", {
      initialUrl: `/teams/${team.id}/players/new`,
    })

    await ERTL.waitFor(() => {
      expect(ERTL.screen.getByPlaceholderText("Last Name"))
      expect(
        ERTL.screen.getByPlaceholderText("Last Name").props.enterKeyHint,
      ).toEqual("next")
    })
  })

  it("shows an prompt to enter the invitees phone number", async () => {
    const team = teamFactory()
    await setupNetworkMocks({ team })

    ERTL.renderRouter("src/app", {
      initialUrl: `/teams/${team.id}/players/new`,
    })

    await ERTL.waitFor(() => {
      expect(ERTL.screen.getByPlaceholderText("Phone Number"))
    })
  })

  it("shows a cancel button", async () => {
    const team = teamFactory()
    await setupNetworkMocks({ team })

    ERTL.renderRouter("src/app", {
      initialUrl: `/teams/${team.id}/players/new`,
    })

    await ERTL.waitFor(() => {
      expect(ERTL.screen.getAllByText("Cancel"))
    })
  })

  describe("when the cancel button is pressed", () => {
    it("goes back to the players list screen", async () => {
      const team = teamFactory({ name: "The Einsteins" })
      await setupNetworkMocks({ team })

      ERTL.renderRouter("src/app", {
        initialUrl: `/teams/${team.id}/players/new`,
      })

      await ERTL.waitFor(() => {
        expect(ERTL.screen).not.toShowTestId("Loading Spinner")
      })

      ERTL.fireEvent.press(ERTL.screen.getAllByText("Cancel")[0])

      await ERTL.waitFor(() => {
        expect(ERTL.screen).toHavePathname(`/teams/${team.id}/players`)
      })
    })
  })

  describe("when a phone number that is in use by an existing teammate is entered", () => {
    it("shows a note indicating why the player cant be added to the team", async () => {
      const team = teamFactory({ name: "Scott's Tots" })
      const teammate = playerFactory({
        first_name: "Angelo",
        last_name: "Grotti",
        phone_number: "0000000000",
      })
      await setupNetworkMocks({ team, players: [teammate] })

      ERTL.renderRouter("src/app", {
        initialUrl: `/teams/${team.id}/players/new`,
      })

      await ERTL.waitFor(() => {
        expect(ERTL.screen).not.toShowTestId("Loading Spinner")
      })

      await ERTL.act(() => {
        typeIntoTestId("Phone Number Field", "0000000000")
      })

      await ERTL.waitFor(() => {
        expect(ERTL.screen).toShowText(
          "Angelo Grotti has that phone number and is already on Scott's Tots.",
        )
      })
    })

    it("does not show a send invite button", async () => {
      const team = teamFactory()
      const teammate = playerFactory({ phone_number: "0000000000" })
      await setupNetworkMocks({ team, players: [teammate] })

      ERTL.renderRouter("src/app", {
        initialUrl: `/teams/${team.id}/players/new`,
      })

      await ERTL.waitFor(() => {
        expect(ERTL.screen).not.toShowTestId("Loading Spinner")
      })

      await ERTL.act(() => {
        typeIntoTestId("First Name Field", "Toby")
        typeIntoTestId("Last Name Field", "Flenderson")
        typeIntoTestId("Phone Number Field", "0000000000")
      })

      await ERTL.waitFor(() => {
        expect(ERTL.screen).not.toShowTestId("Send Invite Button")
      })
    })
  })

  describe("when a first name and last name are entered", () => {
    describe("when a phone number that is not in use by an existing teammate is entered", () => {
      it("shows a send invite button", async () => {
        const team = teamFactory()
        await setupNetworkMocks({ team })

        ERTL.renderRouter("src/app", {
          initialUrl: `/teams/${team.id}/players/new`,
        })

        await ERTL.waitFor(() => {
          expect(ERTL.screen).not.toShowTestId("Loading Spinner")
        })

        await ERTL.act(() => {
          typeIntoTestId("First Name Field", "Toby")
          typeIntoTestId("Last Name Field", "Flenderson")
          typeIntoTestId("Phone Number Field", "0123456789")
        })

        await ERTL.waitFor(() => {
          expect(ERTL.screen).toShowTestId("Send Invite Button")
        })
      })
    })

    describe("when the invite button is pressed", () => {
      it("invites the player to the team", async () => {
        const team = teamFactory()
        const apiToken = await setupNetworkMocks({ team })

        ERTL.renderRouter("src/app", {
          initialUrl: `/teams/${team.id}/players/new`,
        })

        await ERTL.waitFor(() => {
          expect(ERTL.screen).not.toShowTestId("Loading Spinner")
        })

        await ERTL.act(() => {
          typeIntoTestId("First Name Field", "Toby")
          typeIntoTestId("Last Name Field", "Flenderson")
          typeIntoTestId("Phone Number Field", "0123456789")
        })

        const inviteApiRequest = mockRequest({
          apiToken,
          method: "post",
          path: `/teams/${team.id}/players`,
          params: {
            first_name: "Toby",
            last_name: "Flenderson",
            phone_number: "0123456789",
          },
        })

        expect(ERTL.screen).toShowTestId("Send Invite Button")

        ERTL.fireEvent.press(ERTL.screen.getByTestId("Send Invite Button"))

        await ERTL.waitFor(() => {
          expect(inviteApiRequest.isDone()).toBe(true)
        })

        nock.abortPendingRequests()
      })

      it("goes back to the players list screen", async () => {
        const team = teamFactory({ name: "oh my word" })
        const apiToken = await setupNetworkMocks({ team })

        ERTL.renderRouter("src/app", {
          initialUrl: `/teams/${team.id}/players/new`,
        })

        await ERTL.waitFor(() => {
          expect(ERTL.screen).not.toShowTestId("Loading Spinner")
        })

        await ERTL.act(() => {
          typeIntoTestId("First Name Field", "Toby")
          typeIntoTestId("Last Name Field", "Flenderson")
          typeIntoTestId("Phone Number Field", "0123456789")
        })

        mockRequest({
          apiToken,
          method: "post",
          path: `/teams/${team.id}/players`,
          params: {
            first_name: "Toby",
            last_name: "Flenderson",
            phone_number: "0123456789",
          },
        })

        expect(ERTL.screen).toShowTestId("Send Invite Button")

        ERTL.fireEvent.press(ERTL.screen.getByTestId("Send Invite Button"))

        await ERTL.waitFor(() => {
          expect(ERTL.screen).toHavePathname(`/teams/${team?.id}/players`)
        })
      })

      it("shows a flash message indicating that the player was invited", async () => {
        const team = teamFactory({ name: "Scott's Tots" })
        const apiToken = await setupNetworkMocks({ team })

        ERTL.renderRouter("src/app", {
          initialUrl: `/teams/${team.id}/players/new`,
        })

        await ERTL.waitFor(() => {
          expect(ERTL.screen).not.toShowTestId("Loading Spinner")
        })

        await ERTL.act(() => {
          typeIntoTestId("First Name Field", "Toby")
          typeIntoTestId("Last Name Field", "Flenderson")
          typeIntoTestId("Phone Number Field", "0123456789")
        })

        mockRequest({
          apiToken,
          method: "post",
          path: `/teams/${team.id}/players`,
          params: {
            first_name: "Toby",
            last_name: "Flenderson",
            phone_number: "0123456789",
          },
        })

        expect(ERTL.screen).toShowTestId("Send Invite Button")

        ERTL.fireEvent.press(ERTL.screen.getByTestId("Send Invite Button"))

        await ERTL.waitFor(() => {
          expect(ERTL.screen).toHavePathname(`/teams/${team?.id}/players`)
          expect(ERTL.screen).toShowText("Toby was invited to Scott's Tots")
        })
      })

      describe("when the api request fails", () => {
        it("shows a Trouble Connecting to the Internet flash message", async () => {
          const team = teamFactory({ name: "Scott's Tots" })
          const apiToken = await setupNetworkMocks({ team })

          ERTL.renderRouter("src/app", {
            initialUrl: `/teams/${team.id}/players/new`,
          })

          await ERTL.waitFor(() => {
            expect(ERTL.screen).toHaveNavigationBarTitle({
              title: "Scott's Tots Invite",
              nestedNavigationBarIndex: 1,
            })
          })

          expect(ERTL.screen).not.toShowTestId("Send Invite Button")

          await ERTL.act(() => {
            typeIntoTestId("First Name Field", "Toby")
            typeIntoTestId("Last Name Field", "Flenderson")
            typeIntoTestId("Phone Number Field", "0123456789")
          })

          const inviteRequest = mockRequest({
            apiToken,
            method: "post",
            path: `/teams/${team.id}/players`,
            params: {
              first_name: "Toby",
              last_name: "Flenderson",
              phone_number: "0123456789",
            },
            response: "Network Error",
          })

          expect(ERTL.screen).toShowTestId("Send Invite Button")

          ERTL.fireEvent.press(ERTL.screen.getByTestId("Send Invite Button"))

          await ERTL.waitFor(() => {
            expect(inviteRequest.isDone()).toEqual(true)
          })

          await ERTL.waitFor(() =>
            expect(ERTL.screen).toShowText(
              "Trouble Connecting to the Internet",
            ),
          )
        })
      })
    })
  })
})
