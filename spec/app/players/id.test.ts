import * as ReactNative from "react-native"
import * as ERTL from "expo-router/testing-library"
import playerFactory from "../../specHelpers/factories/player"
import mockPlayerFromApi from "../../specHelpers/mockPlayerFromApi"
import Config from "Config"
import mockPlayerAndTextMessageConfirmationCodeFromApi from "../../specHelpers/mockPlayerAndTextMessageConfirmationCodeFromApi"
import mockApi from "../../specHelpers/mockApi"

describe("viewing a player", () => {
  describe("while the player is loaded from the api", () => {
    it("shows a loading spinner", async () => {
      const player = playerFactory({ id: 1 })

      await mockPlayerFromApi({
        playerId: 1,
        response: player,
        test: async () => {
          ERTL.renderRouter("src/app", { initialUrl: "/players/1" })

          await ERTL.waitFor(() => {
            expect(ERTL.screen).toShowTestId("Loading Spinner")
          })
        },
      })
    })

    it("does not show a navigation bar title", async () => {
      const player = playerFactory({ id: 1 })

      await mockPlayerFromApi({
        playerId: 1,
        response: player,
        test: async () => {
          ERTL.renderRouter("src/app", { initialUrl: "/players/1" })

          await ERTL.waitFor(() => {
            expect(ERTL.screen).toHaveNavigationBarTitle("")
          })
        },
      })
    })
  })

  describe("when the player is done loading from the api", () => {
    it("hides the loading spinner", async () => {
      const player = playerFactory({ id: 1 })

      await mockPlayerFromApi({
        playerId: 1,
        response: player,
        test: async () => {
          ERTL.renderRouter("src/app", { initialUrl: "/players/1" })

          await ERTL.waitFor(() => {
            expect(ERTL.screen).not.toShowTestId("Loading Spinner")
          })
        },
      })
    })

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
      const player = playerFactory({
        id: 2,
        phone_number: "0123456789",
      })

      await mockPlayerFromApi({
        playerId: 2,
        response: player,
        test: async () => {
          ERTL.renderRouter("src/app", { initialUrl: "/players/2" })

          await ERTL.waitFor(() => {
            expect(ERTL.screen).toShowText("(012) 345 6789")
          })
        },
      })
    })

    it("shows the players jersey number", async () => {
      const player = playerFactory({
        id: 3,
        jersey_number: 12,
      })

      await mockPlayerFromApi({
        playerId: 3,
        response: player,
        test: async () => {
          ERTL.renderRouter("src/app", { initialUrl: "/players/3" })

          await ERTL.waitFor(() => {
            expect(ERTL.screen).toShowText("#12")
          })
        },
      })
    })

    it("shows a This Is Me button", async () => {
      const player = playerFactory({ id: 1 })

      await mockPlayerFromApi({
        playerId: 1,
        response: player,
        test: async () => {
          ERTL.renderRouter("src/app", { initialUrl: "/players/1" })

          await ERTL.waitFor(() => {
            expect(ERTL.screen).toShowTestId("This is Me Button")
          })
        },
      })
    })

    describe("tapping the This Is Me button", () => {
      it("sends a text message to the players phone number containing a 6-digit code", async () => {
        const playerId = 1
        const player = playerFactory({ id: playerId })

        const urlsOfApiRequests = await mockApi({
          mockedRequests: [
            {
              method: "get",
              route: "/players/[id]",
              params: { id: playerId },
              response: player,
            },
            {
              method: "get",
              route: "/players/[id]/send_text_message_confirmation_code",
              params: { id: playerId },
              response: undefined,
            },
          ],
          test: async () => {
            ERTL.renderRouter("src/app", { initialUrl: "/players/1" })

            await ERTL.waitFor(() => {
              expect(ERTL.screen).toShowTestId("This is Me Button")
            })

            await ERTL.waitFor(() =>
              ERTL.fireEvent.press(
                ERTL.screen.getByTestId("This is Me Button"),
              ),
            )
          },
        })

        expect(urlsOfApiRequests).toContain(
          `${Config.apiUrl}/players/${playerId}/send_text_message_confirmation_code`,
        )
      })

      it("shows an alert with an input to enter the text message's confirmation code", async () => {
        jest.spyOn(ReactNative.Alert, "prompt")

        const playerId = 1
        const player = playerFactory({
          id: playerId,
          phone_number: "0123456789",
        })

        await mockApi({
          mockedRequests: [
            {
              method: "get",
              route: "/players/[id]",
              params: { id: playerId },
              response: player,
            },
            {
              method: "get",
              route: "/players/[id]/send_text_message_confirmation_code",
              params: { id: playerId },
              response: undefined,
            },
          ],
          test: async () => {
            ERTL.renderRouter("src/app", { initialUrl: "/players/1" })

            await ERTL.waitFor(() => {
              expect(ERTL.screen).toShowTestId("This is Me Button")
            })

            await ERTL.waitFor(() =>
              ERTL.fireEvent.press(
                ERTL.screen.getByTestId("This is Me Button"),
              ),
            )

            // https://reactnative.dev/docs/alert#prompt-ios
            const expectedTitle = "We texted you a 6-digit code"
            const expectedMessage = "Enter it here"
            const expectedCallback = expect.any(Function)
            const expectedType = "plain-text"
            const expectedDefaultValue = ""
            const expectedKeyboardType = "number-pad"

            expect(ReactNative.Alert.prompt).toHaveBeenCalledWith(
              expectedTitle,
              expectedMessage,
              expectedCallback,
              expectedType,
              expectedDefaultValue,
              expectedKeyboardType,
            )
          },
        })
      })

      // describe("when the correct code is entered into the prompt", () => {
      //   it("sets the users apiToken in async storage", async () => {
      //     const player = playerFactory({ id: 1, phone_number: "0123456789" })
      //
      //     // await mockPlayerAndTextMessageConfirmationCodeFromApi({
      //     //   playerId: 1,
      //     //   checkTextMessageConfirmationCodeRequestResponse: {
      //     //     status: "correct",
      //     //     apiToken: "faked api token",
      //     //   },
      //     //   response: player,
      //     //   test: async () => {
      //
      //     // nock(Config.apiUrl).get("/players/1").reply(200, player)
      //
      //     ERTL.renderRouter("src/app", { initialUrl: "/players/1" })
      //
      //     await ERTL.waitFor(() => {
      //       expect(ERTL.screen).toShowTestId("This is Me Button")
      //     })
      //
      //     await ERTL.waitFor(() =>
      //       ERTL.fireEvent.press(ERTL.screen.getByTestId("This is Me Button")),
      //     )
      //
      //     await ERTL.fireEvent.changeText("123456")
      //     // },
      //     // })
      //   })
      // })
    })
  })
})
