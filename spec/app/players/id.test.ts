import * as ERTL from "expo-router/testing-library"
import AsyncStorage from "@react-native-async-storage/async-storage"
import playerFactory from "../../specHelpers/factories/player"
import mockPlayerFromApi from "../../specHelpers/mockPlayerFromApi"
import Config from "Config"
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

      it("shows an input popup to enter the text message's confirmation code", async () => {
        const playerId = 1
        const player = playerFactory({ id: playerId })

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

            const confirmationCodeInputPopupTitle = "Sent You Something 🌷"

            await ERTL.waitFor(() =>
              expect(
                ERTL.screen.getByText(confirmationCodeInputPopupTitle),
              ).toBeVisible(),
            )
          },
        })
      })

      describe("when an incomplete (less than 6 characters) code is entered and OK is tapped", () => {
        it("does not attempt to authenticate the user (send a request to the API)", async () => {
          const playerId = 1
          const player = playerFactory({ id: playerId })

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

              const incompleteConfirmationCode = "123"

              await ERTL.waitFor(() => {
                ERTL.fireEvent.changeText(
                  ERTL.screen.getByTestId("Confirmation Code Input"),
                  incompleteConfirmationCode,
                )
              })

              await ERTL.waitFor(() => {
                ERTL.fireEvent.press(ERTL.screen.getByTestId("OK Button"))
              })

              expect(AsyncStorage.setItem).not.toHaveBeenCalled()
            },
          })
        })
      })

      describe("when an incorrect code is entered into the prompt and OK is tapped", () => {
        it("does not authenticate the user (save their api token in async storage)", async () => {
          const playerId = 1
          const player = playerFactory({ id: playerId })

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
              {
                method: "post",
                route: "/players/[id]/check_text_message_confirmation_code",
                params: { id: playerId },
                searchParams: { confirmation_code: "123456" },
                response: { status: "incorrect" },
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

              await ERTL.waitFor(() => {
                ERTL.fireEvent.changeText(
                  ERTL.screen.getByTestId("Confirmation Code Input"),
                  "123456",
                )
              })

              await ERTL.waitFor(() => {
                ERTL.fireEvent.press(ERTL.screen.getByTestId("OK Button"))
              })

              expect(AsyncStorage.setItem).not.toHaveBeenCalled()
            },
          })
        })

        it("sets the displayed (entered) confirmation code to an empty string", async () => {
          const playerId = 1
          const player = playerFactory({ id: playerId })

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
              {
                method: "post",
                route: "/players/[id]/check_text_message_confirmation_code",
                params: { id: playerId },
                searchParams: { confirmation_code: "123456" },
                response: { status: "incorrect" },
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

              await ERTL.waitFor(() => {
                ERTL.fireEvent.changeText(
                  ERTL.screen.getByTestId("Confirmation Code Input"),
                  "123456",
                )
              })

              await ERTL.waitFor(() => {
                expect(ERTL.screen.queryByText("1")).toBeVisible()
                expect(ERTL.screen.queryByText("2")).toBeVisible()
                expect(ERTL.screen.queryByText("3")).toBeVisible()
                expect(ERTL.screen.queryByText("4")).toBeVisible()
                expect(ERTL.screen.queryByText("5")).toBeVisible()
                expect(ERTL.screen.queryByText("6")).toBeVisible()
              })

              await ERTL.waitFor(() => {
                ERTL.fireEvent.press(ERTL.screen.getByTestId("OK Button"))
              })

              await ERTL.waitFor(() => {
                expect(ERTL.screen.queryByText("1")).toBe(null)
                expect(ERTL.screen.queryByText("2")).toBe(null)
                expect(ERTL.screen.queryByText("3")).toBe(null)
                expect(ERTL.screen.queryByText("4")).toBe(null)
                expect(ERTL.screen.queryByText("5")).toBe(null)
                expect(ERTL.screen.queryByText("6")).toBe(null)
              })
            },
          })
        })
      })

      describe("when the correct code is entered into the prompt and OK is tapped", () => {
        it("authenticates the user (saves their api token in async storage)", async () => {
          const playerId = 1
          const player = playerFactory({ id: playerId })

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
              {
                method: "post",
                route: "/players/[id]/check_text_message_confirmation_code",
                params: { id: playerId },
                searchParams: { confirmation_code: "123456" },
                response: { status: "correct", apiToken: "apiTokenFromApi" },
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

              await ERTL.waitFor(() => {
                ERTL.fireEvent.changeText(
                  ERTL.screen.getByTestId("Confirmation Code Input"),
                  "123456",
                )
              })

              await ERTL.waitFor(() => {
                ERTL.fireEvent.press(ERTL.screen.getByTestId("OK Button"))
              })

              expect(AsyncStorage.setItem).toHaveBeenCalledWith(
                "API Token",
                "apiTokenFromApi",
              )
            },
          })
        })
      })
    })
  })
})
