import * as ERTL from "expo-router/testing-library"
import * as ReactNative from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import teamFactory from "spec/specHelpers/factories/team"
import mockLoggedInPlayer from "spec/specHelpers/mockLoggedInPlayer"
import { mockRequest } from "spec/specHelpers/mockApi"

describe("the teams screen", () => {
  afterEach(async () => {
    await AsyncStorage.clear()
  })

  it("shows the players teams", async () => {
    mockRequest({
      method: "get",
      path: "/teams",
      apiToken: await mockLoggedInPlayer(),
      response: [
        teamFactory({ name: "Scott's Tots" }),
        teamFactory({ name: "The Einsteins" }),
      ],
    })

    ERTL.renderRouter("src/app", { initialUrl: "/teams" })

    await ERTL.waitFor(() => {
      expect(ERTL.screen).toShowText("Scott's Tots")
      expect(ERTL.screen).toShowText("The Einsteins")
    })
  })

  it("orders teams alphabetically by name", async () => {
    const improperlySortedTeams = [
      teamFactory({ name: "The Einsteins" }),
      teamFactory({ name: "Scott's Tots" }),
    ]
    mockRequest({
      method: "get",
      path: `/teams`,
      apiToken: await mockLoggedInPlayer(),
      response: improperlySortedTeams,
    })

    ERTL.renderRouter("src/app", { initialUrl: "/teams" })

    await ERTL.waitFor(() => {
      expect(ERTL.screen).not.toShowTestId("Loading Spinner")
    })

    const teamListItems = ERTL.screen.getAllByTestId("Team List Item")

    expect(ERTL.within(teamListItems[0])).toShowText("Scott's Tots")
    expect(ERTL.within(teamListItems[1])).toShowText("The Einsteins")
  })

  describe("tapping a team", () => {
    it("highlights the team list item while the tap is in progress", async () => {
      mockRequest({
        method: "get",
        path: "/teams",
        apiToken: await mockLoggedInPlayer(),
        response: [teamFactory({ name: "Scott's Tots" })],
      })

      ERTL.renderRouter("src/app", { initialUrl: "/teams" })

      await ERTL.waitFor(() => {
        expect(ERTL.screen).not.toShowTestId("Loading Spinner")
      })

      const teamListItems = ERTL.screen.getAllByTestId("Team List Item")

      ERTL.fireEvent(teamListItems[0], "pressIn")

      if (ReactNative.Platform.OS === "ios") {
        await ERTL.waitFor(() => {
          expect(teamListItems[0].props.style.backgroundColor).toEqual({
            semantic: ["tertiarySystemBackground"],
          })
        })
      } else {
        await ERTL.waitFor(() => {
          expect(teamListItems[0].props.style.backgroundColor).toEqual("white")
        })
      }

      ERTL.fireEvent(teamListItems[0], "pressOut")

      if (ReactNative.Platform.OS === "ios") {
        await ERTL.waitFor(() => {
          expect(teamListItems[0].props.style.backgroundColor).not.toEqual({
            semantic: ["tertiarySystemBackground"],
          })
        })
      } else {
        await ERTL.waitFor(() => {
          expect(teamListItems[0].props.style.backgroundColor).not.toEqual(
            "white",
          )
        })
      }
    })
  })
})
