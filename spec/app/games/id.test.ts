import * as ERTL from "expo-router/testing-library"
import * as ReactNative from "react-native"
import * as DateFNS from "date-fns"
import AsyncStorage from "@react-native-async-storage/async-storage"
import gameFactory from "../../specHelpers/factories/game"
import mockGameFromApi from "../../specHelpers/mockGameFromApi"
import type { Game } from "types/Game"
import mockGamesFromApi from "../../specHelpers/mockGamesFromApi"

const gameDateWithWeekday = (game: Game): string =>
  DateFNS.format(DateFNS.parseISO(game.played_at), "EEEE, MMM d")

// const gameTime = (game: Game): string =>
//   DateFNS.format(DateFNS.parseISO(game.played_at), "h:mm a")

const gamePlayedAtValue = ({
  minutesInFuture = 0,
  secondsInFuture = 0,
}: {
  minutesInFuture?: number
  secondsInFuture?: number
}): string =>
  DateFNS.formatISO(
    DateFNS.addMinutes(
      DateFNS.addSeconds(new Date(), secondsInFuture),
      minutesInFuture,
    ),
  )

describe("viewing a game", () => {
  afterEach(async () => {
    await AsyncStorage.clear()
  })

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

    it("shows a list of the games players (for attendance tracking purposes)", async () => {
      const game = gameFactory({
        id: 3,
        players: [
          {
            id: 3,
            first_name: "Toby",
            last_name: "Flenderson",
          },
          {
            id: 1,
            first_name: "Kelly",
            last_name: "Kapoor",
          },
          {
            id: 2,
            first_name: "Meredith",
            last_name: "Palmer",
          },
        ],
      })

      await mockGameFromApi({
        gameId: 3,
        response: game,
        test: async () => {
          ERTL.renderRouter("src/app", { initialUrl: "/games/3" })

          await ERTL.waitFor(() => {
            expect(ERTL.screen).toShowText("Attendance")
            expect(ERTL.screen).toShowText("Toby Flenderson")
            expect(ERTL.screen).toShowText("Kelly Kapoor")
            expect(ERTL.screen).toShowText("Meredith Palmer")
          })
        },
      })
    })

    describe("when the game is in the future and the player is authenticated", () => {
      it("shows an Are You Going To This Game? question with Yes, No, and Maybe options", async () => {
        await AsyncStorage.setItem("API Token", "Faked API Token")
        await AsyncStorage.setItem("User ID", "3")

        const game = gameFactory({
          id: 3,
          played_at: gamePlayedAtValue({ minutesInFuture: 1 }),
        })

        await mockGameFromApi({
          gameId: 3,
          response: game,
          test: async () => {
            ERTL.renderRouter("src/app", { initialUrl: "/games/3" })

            await ERTL.waitFor(() => {
              expect(ERTL.screen).not.toShowTestId("Loading Spinner")
              expect(ERTL.screen).toShowText("Are you going to this game?")
              expect(ERTL.screen).toShowText("Yes")
              expect(ERTL.screen).toShowText("No")
              expect(ERTL.screen).toShowText("Maybe")
            })
          },
        })
      })

      describe("when the game starts", () => {
        it("removes the Are You Going To This Game? question", async () => {
          await AsyncStorage.setItem("API Token", "Faked API Token")
          await AsyncStorage.setItem("User ID", "3")

          const game = gameFactory({
            id: 3,
            played_at: gamePlayedAtValue({ secondsInFuture: 1 }),
          })

          await mockGameFromApi({
            gameId: 3,
            response: game,
            test: async () => {
              ERTL.renderRouter("src/app", { initialUrl: "/games/3" })

              await ERTL.waitFor(() => {
                expect(ERTL.screen).not.toShowTestId("Loading Spinner")
                expect(ERTL.screen).toShowText("Are you going to this game?")
                expect(ERTL.screen).toShowText("Yes")
                expect(ERTL.screen).toShowText("No")
                expect(ERTL.screen).toShowText("Maybe")
              })

              await ERTL.waitFor(() => {
                expect(ERTL.screen).not.toShowText(
                  "Are you going to this game?",
                )
                expect(ERTL.screen).not.toShowText("Yes")
                expect(ERTL.screen).not.toShowText("No")
                expect(ERTL.screen).not.toShowText("Maybe")
              })
            },
          })
        })
      })

      describe("when Yes is tapped", () => {
        it("selects the Yes radio button and shows a checkmark icon by the players name in the attendance list", async () => {
          const playerId = 3
          await AsyncStorage.setItem("API Token", "Faked API Token")
          await AsyncStorage.setItem("User ID", playerId.toString())

          const game = gameFactory({
            id: 1,
            played_at: gamePlayedAtValue({ minutesInFuture: 1 }),
            players: [
              {
                id: playerId,
                first_name: "Michael",
                last_name: "Scott",
              },
              {
                id: 2,
                first_name: "Dwight",
                last_name: "Schrute",
              },
            ],
          })

          await mockGameFromApi({
            gameId: 1,
            response: game,
            test: async () => {
              ERTL.renderRouter("src/app", { initialUrl: "/games/1" })

              await ERTL.waitFor(() => {
                expect(ERTL.screen).not.toShowTestId("Loading Spinner")
              })

              ERTL.userEvent.setup().press(ERTL.screen.getByText("Yes"))

              await ERTL.waitFor(() => {
                expect(
                  ERTL.within(
                    ERTL.screen.getByTestId(
                      `Player ${playerId} Attendance List Item`,
                    ),
                  ),
                ).toShowTestId("Checkmark Icon")
              })

              if (ReactNative.Platform.OS === "ios") {
                await ERTL.waitFor(() => {
                  expect(
                    ERTL.screen.getByTestId("Yes Radio Button").props.style
                      .backgroundColor,
                  ).toEqual({ semantic: ["systemGreen"] })
                })
              } else {
                expect(
                  ERTL.screen.getByTestId("Yes Radio Button").props.style
                    .backgroundColor,
                ).toEqual("green")
              }
            },
          })
        })

        describe("when leaving and returning to the game details screen", () => {
          it("remembers the Yes selection", async () => {
            await AsyncStorage.setItem("API Token", "Faked API Token")
            await AsyncStorage.setItem("User ID", "1")

            const games = [
              gameFactory({
                played_at: gamePlayedAtValue({ minutesInFuture: 30 }),
              }),
            ]

            await mockGamesFromApi({
              response: games,
              test: async () => {
                ERTL.renderRouter("src/app", { initialUrl: "/games" })

                await ERTL.waitFor(() => {
                  expect(ERTL.screen).not.toShowTestId("Loading Spinner")
                })

                ERTL.fireEvent.press(ERTL.screen.getByTestId("Game List Item"))

                await ERTL.waitFor(() => {
                  expect(ERTL.screen).toShowText("Yes")
                })

                ERTL.fireEvent.press(ERTL.screen.getByText("Yes"))

                ERTL.fireEvent.press(ERTL.screen.getByTestId("Go Back"))

                ERTL.fireEvent.press(ERTL.screen.getByTestId("Game List Item"))

                if (ReactNative.Platform.OS === "ios") {
                  await ERTL.waitFor(() => {
                    expect(
                      ERTL.screen.getByTestId("Yes Radio Button").props.style
                        .backgroundColor,
                    ).toEqual({ semantic: ["systemGreen"] })
                  })
                } else {
                  expect(
                    ERTL.screen.getByTestId("Yes Radio Button").props.style
                      .backgroundColor,
                  ).toEqual("green")
                }
              },
            })
          })
        })

        describe("when leaving the games details screen and entering another games details screen", () => {
          it("does not change the Yes selection on the details screen of the other game", async () => {
            await AsyncStorage.setItem("API Token", "Faked API Token")
            await AsyncStorage.setItem("User ID", "1")

            const games = [
              gameFactory({
                played_at: gamePlayedAtValue({ minutesInFuture: 30 }),
              }),
              gameFactory({
                played_at: gamePlayedAtValue({ minutesInFuture: 60 }),
              }),
            ]

            await mockGamesFromApi({
              response: games,
              test: async () => {
                ERTL.renderRouter("src/app", { initialUrl: "/games" })

                await ERTL.waitFor(() => {
                  expect(ERTL.screen).not.toShowTestId("Loading Spinner")
                })

                ERTL.fireEvent.press(
                  ERTL.screen.getAllByTestId("Game List Item")[0],
                )

                await ERTL.waitFor(() => {
                  expect(ERTL.screen).toShowText("Yes")
                })

                ERTL.fireEvent.press(ERTL.screen.getByText("Yes"))

                ERTL.fireEvent.press(ERTL.screen.getByTestId("Go Back"))

                ERTL.fireEvent.press(
                  ERTL.screen.getAllByTestId("Game List Item")[1],
                )

                if (ReactNative.Platform.OS === "ios") {
                  await ERTL.waitFor(() => {
                    expect(
                      ERTL.screen.getByTestId("Yes Radio Button").props.style
                        .backgroundColor,
                    ).not.toEqual({ semantic: ["systemGreen"] })
                  })
                } else {
                  expect(
                    ERTL.screen.getByTestId("Yes Radio Button").props.style
                      .backgroundColor,
                  ).not.toEqual("green")
                }
              },
            })
          })
        })

        describe("when No is tapped after tapping Yes", () => {
          it("removes the checkmark icon by the players name in the attendance list", async () => {
            const playerId = 3
            await AsyncStorage.setItem("API Token", "Faked API Token")
            await AsyncStorage.setItem("User ID", playerId.toString())

            const game = gameFactory({
              id: 1,
              played_at: gamePlayedAtValue({ minutesInFuture: 1 }),
              players: [
                {
                  id: playerId,
                  first_name: "Michael",
                  last_name: "Scott",
                },
                {
                  id: 2,
                  first_name: "Dwight",
                  last_name: "Schrute",
                },
              ],
            })

            await mockGameFromApi({
              gameId: 1,
              response: game,
              test: async () => {
                ERTL.renderRouter("src/app", { initialUrl: "/games/1" })

                await ERTL.waitFor(() => {
                  expect(ERTL.screen).not.toShowTestId("Loading Spinner")
                })

                ERTL.userEvent.setup().press(ERTL.screen.getByText("Yes"))

                await ERTL.waitFor(() => {
                  expect(
                    ERTL.within(
                      ERTL.screen.getByTestId(
                        `Player ${playerId} Attendance List Item`,
                      ),
                    ),
                  ).toShowTestId("Checkmark Icon")
                })

                ERTL.userEvent.setup().press(ERTL.screen.getByText("No"))

                await ERTL.waitFor(() => {
                  expect(
                    ERTL.within(
                      ERTL.screen.getByTestId(
                        `Player ${playerId} Attendance List Item`,
                      ),
                    ),
                  ).not.toShowTestId("Checkmark Icon")
                })
              },
            })
          })
        })

        describe("when Maybe is tapped after tapping Yes", () => {
          it("removes the checkmark icon by the players name in the attendance list", async () => {
            const playerId = 3
            await AsyncStorage.setItem("API Token", "Faked API Token")
            await AsyncStorage.setItem("User ID", playerId.toString())

            const game = gameFactory({
              id: 1,
              played_at: gamePlayedAtValue({ minutesInFuture: 1 }),
              players: [
                {
                  id: playerId,
                  first_name: "Michael",
                  last_name: "Scott",
                },
                {
                  id: 2,
                  first_name: "Dwight",
                  last_name: "Schrute",
                },
              ],
            })

            await mockGameFromApi({
              gameId: 1,
              response: game,
              test: async () => {
                ERTL.renderRouter("src/app", { initialUrl: "/games/1" })

                await ERTL.waitFor(() => {
                  expect(ERTL.screen).not.toShowTestId("Loading Spinner")
                })

                ERTL.userEvent.setup().press(ERTL.screen.getByText("Yes"))

                await ERTL.waitFor(() => {
                  expect(
                    ERTL.within(
                      ERTL.screen.getByTestId(
                        `Player ${playerId} Attendance List Item`,
                      ),
                    ),
                  ).toShowTestId("Checkmark Icon")
                })

                ERTL.userEvent.setup().press(ERTL.screen.getByText("Maybe"))

                await ERTL.waitFor(() => {
                  expect(
                    ERTL.within(
                      ERTL.screen.getByTestId(
                        `Player ${playerId} Attendance List Item`,
                      ),
                    ),
                  ).not.toShowTestId("Checkmark Icon")
                })
              },
            })
          })
        })
      })

      describe("when No is tapped", () => {
        it("selects the No radio button and shows an X icon by the players name in the attendance list", async () => {
          const playerId = 3
          await AsyncStorage.setItem("API Token", "Faked API Token")
          await AsyncStorage.setItem("User ID", playerId.toString())

          const game = gameFactory({
            id: 1,
            played_at: gamePlayedAtValue({ minutesInFuture: 1 }),
            players: [
              {
                id: playerId,
                first_name: "Michael",
                last_name: "Scott",
              },
              {
                id: 2,
                first_name: "Dwight",
                last_name: "Schrute",
              },
            ],
          })

          await mockGameFromApi({
            gameId: 1,
            response: game,
            test: async () => {
              ERTL.renderRouter("src/app", { initialUrl: "/games/1" })

              await ERTL.waitFor(() => {
                expect(ERTL.screen).not.toShowTestId("Loading Spinner")
              })

              ERTL.userEvent.setup().press(ERTL.screen.getByText("No"))

              await ERTL.waitFor(() => {
                expect(
                  ERTL.within(
                    ERTL.screen.getByTestId(
                      `Player ${playerId} Attendance List Item`,
                    ),
                  ),
                ).toShowTestId("X Icon")
              })

              if (ReactNative.Platform.OS === "ios") {
                await ERTL.waitFor(() => {
                  expect(
                    ERTL.screen.getByTestId("No Radio Button").props.style
                      .backgroundColor,
                  ).toEqual({ semantic: ["systemRed"] })
                })
              } else {
                expect(
                  ERTL.screen.getByTestId("No Radio Button").props.style
                    .backgroundColor,
                ).toEqual("red")
              }
            },
          })
        })

        describe("when leaving and returning to the game details screen", () => {
          it("remembers the No selection", async () => {
            await AsyncStorage.setItem("API Token", "Faked API Token")
            await AsyncStorage.setItem("User ID", "1")

            const games = [
              gameFactory({
                played_at: gamePlayedAtValue({ minutesInFuture: 30 }),
              }),
            ]

            await mockGamesFromApi({
              response: games,
              test: async () => {
                ERTL.renderRouter("src/app", { initialUrl: "/games" })

                await ERTL.waitFor(() => {
                  expect(ERTL.screen).not.toShowTestId("Loading Spinner")
                })

                ERTL.fireEvent.press(ERTL.screen.getByTestId("Game List Item"))

                await ERTL.waitFor(() => {
                  expect(ERTL.screen).toShowText("No")
                })

                ERTL.fireEvent.press(ERTL.screen.getByText("No"))

                ERTL.fireEvent.press(ERTL.screen.getByTestId("Go Back"))

                ERTL.fireEvent.press(ERTL.screen.getByTestId("Game List Item"))

                if (ReactNative.Platform.OS === "ios") {
                  await ERTL.waitFor(() => {
                    expect(
                      ERTL.screen.getByTestId("No Radio Button").props.style
                        .backgroundColor,
                    ).toEqual({ semantic: ["systemRed"] })
                  })
                } else {
                  expect(
                    ERTL.screen.getByTestId("No Radio Button").props.style
                      .backgroundColor,
                  ).toEqual("red")
                }
              },
            })
          })
        })

        describe("when leaving the games details screen and entering another games details screen", () => {
          it("does not change the No selection on the details screen of the other game", async () => {
            await AsyncStorage.setItem("API Token", "Faked API Token")
            await AsyncStorage.setItem("User ID", "1")

            const games = [
              gameFactory({
                played_at: gamePlayedAtValue({ minutesInFuture: 30 }),
              }),
              gameFactory({
                played_at: gamePlayedAtValue({ minutesInFuture: 60 }),
              }),
            ]

            await mockGamesFromApi({
              response: games,
              test: async () => {
                ERTL.renderRouter("src/app", { initialUrl: "/games" })

                await ERTL.waitFor(() => {
                  expect(ERTL.screen).not.toShowTestId("Loading Spinner")
                })

                ERTL.fireEvent.press(
                  ERTL.screen.getAllByTestId("Game List Item")[0],
                )

                await ERTL.waitFor(() => {
                  expect(ERTL.screen).toShowText("No")
                })

                ERTL.fireEvent.press(ERTL.screen.getByText("No"))

                ERTL.fireEvent.press(ERTL.screen.getByTestId("Go Back"))

                ERTL.fireEvent.press(
                  ERTL.screen.getAllByTestId("Game List Item")[1],
                )

                if (ReactNative.Platform.OS === "ios") {
                  await ERTL.waitFor(() => {
                    expect(
                      ERTL.screen.getByTestId("No Radio Button").props.style
                        .backgroundColor,
                    ).not.toEqual({ semantic: ["systemRed"] })
                  })
                } else {
                  expect(
                    ERTL.screen.getByTestId("No Radio Button").props.style
                      .backgroundColor,
                  ).not.toEqual("red")
                }
              },
            })
          })
        })

        describe("when Yes is tapped after tapping No", () => {
          it("removes the X icon by the players name in the attendance list", async () => {
            const playerId = 3
            await AsyncStorage.setItem("API Token", "Faked API Token")
            await AsyncStorage.setItem("User ID", playerId.toString())

            const game = gameFactory({
              id: 1,
              played_at: gamePlayedAtValue({ minutesInFuture: 1 }),
              players: [
                {
                  id: playerId,
                  first_name: "Michael",
                  last_name: "Scott",
                },
                {
                  id: 2,
                  first_name: "Dwight",
                  last_name: "Schrute",
                },
              ],
            })

            await mockGameFromApi({
              gameId: 1,
              response: game,
              test: async () => {
                ERTL.renderRouter("src/app", { initialUrl: "/games/1" })

                await ERTL.waitFor(() => {
                  expect(ERTL.screen).not.toShowTestId("Loading Spinner")
                })

                ERTL.userEvent.setup().press(ERTL.screen.getByText("No"))

                await ERTL.waitFor(() => {
                  expect(
                    ERTL.within(
                      ERTL.screen.getByTestId(
                        `Player ${playerId} Attendance List Item`,
                      ),
                    ),
                  ).toShowTestId("X Icon")
                })

                ERTL.userEvent.setup().press(ERTL.screen.getByText("Yes"))

                await ERTL.waitFor(() => {
                  expect(
                    ERTL.within(
                      ERTL.screen.getByTestId(
                        `Player ${playerId} Attendance List Item`,
                      ),
                    ),
                  ).not.toShowTestId("X Icon")
                })
              },
            })
          })
        })

        describe("when Maybe is tapped after tapping No", () => {
          it("removes the X icon by the players name in the attendance list", async () => {
            const playerId = 3
            await AsyncStorage.setItem("API Token", "Faked API Token")
            await AsyncStorage.setItem("User ID", playerId.toString())

            const game = gameFactory({
              id: 1,
              played_at: gamePlayedAtValue({ minutesInFuture: 1 }),
              players: [
                {
                  id: playerId,
                  first_name: "Michael",
                  last_name: "Scott",
                },
                {
                  id: 2,
                  first_name: "Dwight",
                  last_name: "Schrute",
                },
              ],
            })

            await mockGameFromApi({
              gameId: 1,
              response: game,
              test: async () => {
                ERTL.renderRouter("src/app", { initialUrl: "/games/1" })

                await ERTL.waitFor(() => {
                  expect(ERTL.screen).not.toShowTestId("Loading Spinner")
                })

                ERTL.userEvent.setup().press(ERTL.screen.getByText("No"))

                await ERTL.waitFor(() => {
                  expect(
                    ERTL.within(
                      ERTL.screen.getByTestId(
                        `Player ${playerId} Attendance List Item`,
                      ),
                    ),
                  ).toShowTestId("X Icon")
                })

                ERTL.userEvent.setup().press(ERTL.screen.getByText("Maybe"))

                await ERTL.waitFor(() => {
                  expect(
                    ERTL.within(
                      ERTL.screen.getByTestId(
                        `Player ${playerId} Attendance List Item`,
                      ),
                    ),
                  ).not.toShowTestId("X Icon")
                })
              },
            })
          })
        })
      })

      describe("when Maybe is tapped", () => {
        it("selects the Maybe radio button and shows a ? icon by the players name in the attendance list", async () => {
          const playerId = 3
          await AsyncStorage.setItem("API Token", "Faked API Token")
          await AsyncStorage.setItem("User ID", playerId.toString())

          const game = gameFactory({
            id: 1,
            played_at: gamePlayedAtValue({ minutesInFuture: 1 }),
            players: [
              {
                id: playerId,
                first_name: "Michael",
                last_name: "Scott",
              },
              {
                id: 2,
                first_name: "Dwight",
                last_name: "Schrute",
              },
            ],
          })

          await mockGameFromApi({
            gameId: 1,
            response: game,
            test: async () => {
              ERTL.renderRouter("src/app", { initialUrl: "/games/1" })

              await ERTL.waitFor(() => {
                expect(ERTL.screen).not.toShowTestId("Loading Spinner")
              })

              ERTL.userEvent.setup().press(ERTL.screen.getByText("Maybe"))

              await ERTL.waitFor(() => {
                expect(
                  ERTL.within(
                    ERTL.screen.getByTestId(
                      `Player ${playerId} Attendance List Item`,
                    ),
                  ),
                ).toShowTestId("? Icon")
              })

              if (ReactNative.Platform.OS === "ios") {
                await ERTL.waitFor(() => {
                  expect(
                    ERTL.screen.getByTestId("Maybe Radio Button").props.style
                      .backgroundColor,
                  ).toEqual({ semantic: ["systemYellow"] })
                })
              } else {
                expect(
                  ERTL.screen.getByTestId("Maybe Radio Button").props.style
                    .backgroundColor,
                ).toEqual("yellow")
              }
            },
          })
        })

        describe("when leaving and returning to the game details screen", () => {
          it("remembers the Maybe selection", async () => {
            await AsyncStorage.setItem("API Token", "Faked API Token")
            await AsyncStorage.setItem("User ID", "1")

            const games = [
              gameFactory({
                played_at: gamePlayedAtValue({ minutesInFuture: 30 }),
              }),
            ]

            await mockGamesFromApi({
              response: games,
              test: async () => {
                ERTL.renderRouter("src/app", { initialUrl: "/games" })

                await ERTL.waitFor(() => {
                  expect(ERTL.screen).not.toShowTestId("Loading Spinner")
                })

                ERTL.fireEvent.press(ERTL.screen.getByTestId("Game List Item"))

                await ERTL.waitFor(() => {
                  expect(ERTL.screen).toShowText("Maybe")
                })

                ERTL.fireEvent.press(ERTL.screen.getByText("Maybe"))

                ERTL.fireEvent.press(ERTL.screen.getByTestId("Go Back"))

                ERTL.fireEvent.press(ERTL.screen.getByTestId("Game List Item"))

                if (ReactNative.Platform.OS === "ios") {
                  await ERTL.waitFor(() => {
                    expect(
                      ERTL.screen.getByTestId("Maybe Radio Button").props.style
                        .backgroundColor,
                    ).toEqual({ semantic: ["systemYellow"] })
                  })
                } else {
                  expect(
                    ERTL.screen.getByTestId("Maybe Radio Button").props.style
                      .backgroundColor,
                  ).toEqual("yellow")
                }
              },
            })
          })
        })

        describe("when leaving the games details screen and entering another games details screen", () => {
          it("does not change the Maybe selection on the details screen of the other game", async () => {
            await AsyncStorage.setItem("API Token", "Faked API Token")
            await AsyncStorage.setItem("User ID", "1")

            const games = [
              gameFactory({
                played_at: gamePlayedAtValue({ minutesInFuture: 30 }),
              }),
              gameFactory({
                played_at: gamePlayedAtValue({ minutesInFuture: 60 }),
              }),
            ]

            await mockGamesFromApi({
              response: games,
              test: async () => {
                ERTL.renderRouter("src/app", { initialUrl: "/games" })

                await ERTL.waitFor(() => {
                  expect(ERTL.screen).not.toShowTestId("Loading Spinner")
                })

                ERTL.fireEvent.press(
                  ERTL.screen.getAllByTestId("Game List Item")[0],
                )

                await ERTL.waitFor(() => {
                  expect(ERTL.screen).toShowText("Maybe")
                })

                ERTL.fireEvent.press(ERTL.screen.getByText("Maybe"))

                ERTL.fireEvent.press(ERTL.screen.getByTestId("Go Back"))

                ERTL.fireEvent.press(
                  ERTL.screen.getAllByTestId("Game List Item")[1],
                )

                if (ReactNative.Platform.OS === "ios") {
                  await ERTL.waitFor(() => {
                    expect(
                      ERTL.screen.getByTestId("Maybe Radio Button").props.style
                        .backgroundColor,
                    ).not.toEqual({ semantic: ["systemYellow"] })
                  })
                } else {
                  expect(
                    ERTL.screen.getByTestId("Maybe Radio Button").props.style
                      .backgroundColor,
                  ).not.toEqual("yellow")
                }
              },
            })
          })
        })

        describe("when Yes is tapped after tapping Maybe", () => {
          it("removes the ? icon by the players name in the attendance list", async () => {
            const playerId = 3
            await AsyncStorage.setItem("API Token", "Faked API Token")
            await AsyncStorage.setItem("User ID", playerId.toString())

            const game = gameFactory({
              id: 1,
              played_at: gamePlayedAtValue({ minutesInFuture: 1 }),
              players: [
                {
                  id: playerId,
                  first_name: "Michael",
                  last_name: "Scott",
                },
                {
                  id: 2,
                  first_name: "Dwight",
                  last_name: "Schrute",
                },
              ],
            })

            await mockGameFromApi({
              gameId: 1,
              response: game,
              test: async () => {
                ERTL.renderRouter("src/app", { initialUrl: "/games/1" })

                await ERTL.waitFor(() => {
                  expect(ERTL.screen).not.toShowTestId("Loading Spinner")
                })

                ERTL.userEvent.setup().press(ERTL.screen.getByText("Maybe"))

                await ERTL.waitFor(() => {
                  expect(
                    ERTL.within(
                      ERTL.screen.getByTestId(
                        `Player ${playerId} Attendance List Item`,
                      ),
                    ),
                  ).toShowTestId("? Icon")
                })

                ERTL.userEvent.setup().press(ERTL.screen.getByText("Yes"))

                await ERTL.waitFor(() => {
                  expect(
                    ERTL.within(
                      ERTL.screen.getByTestId(
                        `Player ${playerId} Attendance List Item`,
                      ),
                    ),
                  ).not.toShowTestId("? Icon")
                })
              },
            })
          })
        })

        describe("when No is tapped after tapping Maybe", () => {
          it("removes the X icon by the players name in the attendance list", async () => {
            const playerId = 3
            await AsyncStorage.setItem("API Token", "Faked API Token")
            await AsyncStorage.setItem("User ID", playerId.toString())

            const game = gameFactory({
              id: 1,
              played_at: gamePlayedAtValue({ minutesInFuture: 1 }),
              players: [
                {
                  id: playerId,
                  first_name: "Michael",
                  last_name: "Scott",
                },
                {
                  id: 2,
                  first_name: "Dwight",
                  last_name: "Schrute",
                },
              ],
            })

            await mockGameFromApi({
              gameId: 1,
              response: game,
              test: async () => {
                ERTL.renderRouter("src/app", { initialUrl: "/games/1" })

                await ERTL.waitFor(() => {
                  expect(ERTL.screen).not.toShowTestId("Loading Spinner")
                })

                ERTL.userEvent.setup().press(ERTL.screen.getByText("Maybe"))

                await ERTL.waitFor(() => {
                  expect(
                    ERTL.within(
                      ERTL.screen.getByTestId(
                        `Player ${playerId} Attendance List Item`,
                      ),
                    ),
                  ).toShowTestId("? Icon")
                })

                ERTL.userEvent.setup().press(ERTL.screen.getByText("No"))

                await ERTL.waitFor(() => {
                  expect(
                    ERTL.within(
                      ERTL.screen.getByTestId(
                        `Player ${playerId} Attendance List Item`,
                      ),
                    ),
                  ).not.toShowTestId("? Icon")
                })
              },
            })
          })
        })
      })
    })

    describe("when the game has already started or is in the past", () => {
      it("does not show an Are You Going To This Game? question with Yes, No, and Maybe options", async () => {
        await AsyncStorage.setItem("API Token", "Faked API Token")

        const game = gameFactory({
          id: 3,
          played_at: gamePlayedAtValue({ minutesInFuture: -1 }),
        })

        await mockGameFromApi({
          gameId: 3,
          response: game,
          test: async () => {
            ERTL.renderRouter("src/app", { initialUrl: "/games/3" })

            await ERTL.waitFor(() => {
              expect(ERTL.screen).not.toShowTestId("Loading Spinner")
              expect(ERTL.screen).not.toShowText("Are you going to this game?")
              expect(ERTL.screen).not.toShowText("Yes")
              expect(ERTL.screen).not.toShowText("No")
              expect(ERTL.screen).not.toShowText("Maybe")
            })
          },
        })
      })
    })

    describe("when the game is in the future and the user is not authenticated", () => {
      it("does not show an Are You Going To This Game? question with Yes, No, and Maybe options", async () => {
        const game = gameFactory({
          id: 3,
          played_at: gamePlayedAtValue({ minutesInFuture: 1 }),
        })

        await mockGameFromApi({
          gameId: 3,
          response: game,
          test: async () => {
            ERTL.renderRouter("src/app", { initialUrl: "/games/3" })

            await ERTL.waitFor(() => {
              expect(ERTL.screen).not.toShowTestId("Loading Spinner")
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
