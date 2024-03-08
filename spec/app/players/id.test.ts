import * as ReactNative from "react-native"
import * as ERTL from "expo-router/testing-library"
import playerFactory from "../../specHelpers/factories/player"
import mockPlayerFromApi from "../../specHelpers/mockPlayerFromApi"
import Config from "Config"
import mockPlayerAndTextMessageConfirmationCodeFromApi from "../../specHelpers/mockPlayerAndTextMessageConfirmationCodeFromApi"

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
        // jest.spyOn(ReactNative.Alert, "alert")

        const player = playerFactory({ id: 1, phone_number: "0123456789" })

        const urlsOfApiRequests =
          await mockPlayerAndTextMessageConfirmationCodeFromApi({
            playerId: 1,
            response: player,
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
          `${Config.apiUrl}/players/1/send_text_message_confirmation_code`,
        )
      })

      it("shows an alert with an input to enter the text message's confirmation code", async () => {
        jest.spyOn(ReactNative.Alert, "prompt")

        const player = playerFactory({ id: 1, phone_number: "0123456789" })

        await mockPlayerAndTextMessageConfirmationCodeFromApi({
          playerId: 1,
          response: player,
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

            expect(ReactNative.Alert.prompt).toHaveBeenCalledWith(
              "We texted you a 6-digit code",
              "Enter it here",
              expect.any(Function),
              "plain-text",
              "",
              "number-pad",
            )
          },
        })
      })
    })
  })
})
