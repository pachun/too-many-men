import * as ERTL from "expo-router/testing-library"
import AsyncStorage from "@react-native-async-storage/async-storage"
import playerFactory from "../../specHelpers/factories/player"
import Config from "Config"
import mockApi, {
  mockCheckPlayersTextMessageConfirmationCode,
  mockGetPlayer,
  mockSendPlayersTextMessageConfirmationCode,
} from "../../specHelpers/mockApi"

describe("viewing a player", () => {
  afterEach(async () => {
    await AsyncStorage.clear()
  })

  describe("while the player is loaded from the api", () => {
    it("shows a loading spinner", async () => {
      await mockApi({
        mockedRequests: [mockGetPlayer(playerFactory({}))],
        test: async () => {
          ERTL.renderRouter("src/app", { initialUrl: "/players/1" })

          await ERTL.waitFor(() => {
            expect(ERTL.screen).toShowTestId("Loading Spinner")
          })
        },
      })
    })

    it("does not show a navigation bar title", async () => {
      const player = playerFactory({})

      await mockApi({
        mockedRequests: [mockGetPlayer(player)],
        test: async () => {
          ERTL.renderRouter("src/app", { initialUrl: `/players/${player.id}` })

          await ERTL.waitFor(() => {
            expect(ERTL.screen).toHaveNavigationBarTitle("")
          })
        },
      })
    })
  })

  describe("when the player is done loading from the api", () => {
    it("hides the loading spinner", async () => {
      const player = playerFactory({})

      await mockApi({
        mockedRequests: [mockGetPlayer(player)],
        test: async () => {
          ERTL.renderRouter("src/app", { initialUrl: `/players/${player.id}` })

          await ERTL.waitFor(() => {
            expect(ERTL.screen).not.toShowTestId("Loading Spinner")
          })
        },
      })
    })

    it("sets the navigation bar title to the player's name", async () => {
      const jimHalpert = playerFactory({
        first_name: "Jim",
        last_name: "Halpert",
      })

      await mockApi({
        mockedRequests: [mockGetPlayer(jimHalpert)],
        test: async () => {
          ERTL.renderRouter("src/app", {
            initialUrl: `/players/${jimHalpert.id}`,
          })

          await ERTL.waitFor(() => {
            expect(ERTL.screen).toHaveNavigationBarTitle("Jim Halpert")
          })
        },
      })
    })

    it("shows the players phone number", async () => {
      const player = playerFactory({
        phone_number: "0123456789",
      })

      await mockApi({
        mockedRequests: [mockGetPlayer(player)],
        test: async () => {
          ERTL.renderRouter("src/app", { initialUrl: `/players/${player.id}` })

          await ERTL.waitFor(() => {
            expect(ERTL.screen).toShowText("(012) 345-6789")
          })
        },
      })
    })

    it("shows the players jersey number", async () => {
      const player = playerFactory({
        jersey_number: 12,
      })

      await mockApi({
        mockedRequests: [mockGetPlayer(player)],
        test: async () => {
          ERTL.renderRouter("src/app", { initialUrl: `/players/${player.id}` })

          await ERTL.waitFor(() => {
            expect(ERTL.screen).toShowText("#12")
          })
        },
      })
    })

    describe("when the player has been authenticated", () => {
      it("does not show a This Is Me button", async () => {
        await AsyncStorage.setItem("API Token", "apiToken")
        await AsyncStorage.setItem("User ID", "1")

        const player = playerFactory({})

        await mockApi({
          mockedRequests: [mockGetPlayer(player)],
          test: async () => {
            ERTL.renderRouter("src/app", {
              initialUrl: `/players/${player.id}`,
            })

            await ERTL.waitFor(() => {
              expect(ERTL.screen).not.toShowTestId("Loading Spinner")
            })

            await ERTL.waitFor(() => {
              expect(ERTL.screen).not.toShowTestId("This is Me Button")
            })
          },
        })
      })
    })

    describe("when the player is not authenticated", () => {
      it("shows a This Is Me button", async () => {
        const player = playerFactory({})

        await mockApi({
          mockedRequests: [mockGetPlayer(player)],
          test: async () => {
            ERTL.renderRouter("src/app", {
              initialUrl: `/players/${player.id}`,
            })

            await ERTL.waitFor(() => {
              expect(ERTL.screen).toShowTestId("This is Me Button")
            })
          },
        })
      })

      describe("tapping the This Is Me button", () => {
        it("sends a text message to the players phone number containing a 6-digit code", async () => {
          const player = playerFactory({})

          const urlsOfApiRequests = await mockApi({
            mockedRequests: [
              mockGetPlayer(player),
              mockSendPlayersTextMessageConfirmationCode(player),
            ],
            test: async () => {
              ERTL.renderRouter("src/app", {
                initialUrl: `/players/${player.id}`,
              })

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
            `${Config.apiUrl}/players/${player.id}/send_text_message_confirmation_code`,
          )
        })

        it("shows an input popup to enter the text message's confirmation code", async () => {
          const player = playerFactory({})

          await mockApi({
            mockedRequests: [
              mockGetPlayer(player),
              mockSendPlayersTextMessageConfirmationCode(player),
            ],
            test: async () => {
              ERTL.renderRouter("src/app", {
                initialUrl: `/players/${player.id}`,
              })

              await ERTL.waitFor(() => {
                expect(ERTL.screen).toShowTestId("This is Me Button")
              })

              await ERTL.waitFor(() =>
                ERTL.fireEvent.press(
                  ERTL.screen.getByTestId("This is Me Button"),
                ),
              )

              const confirmationCodeInputPopupTitle = "Texted You 😘"

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
            const player = playerFactory({})

            await mockApi({
              mockedRequests: [
                mockGetPlayer(player),
                mockSendPlayersTextMessageConfirmationCode(player),
              ],
              test: async () => {
                ERTL.renderRouter("src/app", {
                  initialUrl: `/players/${player.id}`,
                })

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

                expect(await AsyncStorage.getItem("API Token")).toBe(null)
              },
            })
          })
        })

        describe("when an incorrect code is entered into the prompt and OK is tapped", () => {
          it("does not authenticate the user (save their api token in async storage)", async () => {
            const player = playerFactory({})

            await mockApi({
              mockedRequests: [
                mockGetPlayer(player),
                mockSendPlayersTextMessageConfirmationCode(player),
                mockCheckPlayersTextMessageConfirmationCode(player, "123456", {
                  status: "incorrect",
                }),
              ],
              test: async () => {
                ERTL.renderRouter("src/app", {
                  initialUrl: `/players/${player.id}`,
                })

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

                expect(await AsyncStorage.getItem("API Token")).toBe(null)
              },
            })
          })

          it("sets the displayed (entered) confirmation code to an empty string", async () => {
            const player = playerFactory({})

            await mockApi({
              mockedRequests: [
                mockGetPlayer(player),
                mockSendPlayersTextMessageConfirmationCode(player),
                mockCheckPlayersTextMessageConfirmationCode(player, "123456", {
                  status: "incorrect",
                }),
              ],
              test: async () => {
                ERTL.renderRouter("src/app", {
                  initialUrl: `/players/${player.id}`,
                })

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

                expect(
                  ERTL.screen.getByTestId("Confirmation Code Input").props
                    .value,
                ).toEqual("123456")

                await ERTL.waitFor(() => {
                  ERTL.fireEvent.press(ERTL.screen.getByTestId("OK Button"))
                })

                expect(
                  ERTL.screen.getByTestId("Confirmation Code Input").props
                    .value,
                ).toEqual("")
              },
            })
          })
        })

        describe("when the correct code is entered into the prompt and OK is tapped", () => {
          it("authenticates the user (saves their api token and user id in async storage)", async () => {
            const player = playerFactory({})

            await mockApi({
              mockedRequests: [
                mockGetPlayer(player),
                mockSendPlayersTextMessageConfirmationCode(player),
                mockCheckPlayersTextMessageConfirmationCode(player, "123456", {
                  status: "correct",
                  api_token: "apiTokenFromApi",
                }),
              ],
              test: async () => {
                ERTL.renderRouter("src/app", {
                  initialUrl: `/players/${player.id}`,
                })

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

                expect(await AsyncStorage.getItem("API Token")).toEqual(
                  "apiTokenFromApi",
                )
                expect(await AsyncStorage.getItem("User ID")).toEqual(
                  player.id.toString(),
                )
              },
            })
          })

          it("displays a flash message indicating that the player was authenticated", async () => {
            const player = playerFactory({ first_name: "Meredith" })

            await mockApi({
              mockedRequests: [
                mockGetPlayer(player),
                mockSendPlayersTextMessageConfirmationCode(player),
                mockCheckPlayersTextMessageConfirmationCode(player, "123456", {
                  status: "correct",
                  api_token: "apiTokenFromApi",
                }),
              ],
              test: async () => {
                ERTL.renderRouter("src/app", {
                  initialUrl: `/players/${player.id}`,
                })

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

                await ERTL.waitFor(() => {
                  expect(ERTL.screen).toShowText(
                    "Hey Meredith! You're signed in.",
                  )
                })

                const secondsTheFlashMethodIsShown = 7
                const secondsToWaitForFlashMessageToDisappear =
                  secondsTheFlashMethodIsShown + 1
                const millisecondsToWaitForFlashMessageToDisappear =
                  secondsToWaitForFlashMessageToDisappear * 1000

                await ERTL.waitFor(
                  () => {
                    expect(ERTL.screen).not.toShowText(
                      "Hey Meredith! You're signed in.",
                    )
                  },
                  { timeout: millisecondsToWaitForFlashMessageToDisappear },
                )
              },
            })
          })
        })
      })
    })
  })
})
