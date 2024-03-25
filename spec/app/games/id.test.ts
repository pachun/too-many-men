import * as ERTL from "expo-router/testing-library"
import * as DateFNS from "date-fns"
import AsyncStorage from "@react-native-async-storage/async-storage"
import gameFactory from "../../specHelpers/factories/game"
import mockGameFromApi from "../../specHelpers/mockGameFromApi"
import type { Game } from "types/Game"

const gameDateWithWeekday = (game: Game): string =>
  DateFNS.format(DateFNS.parseISO(game.played_at), "EEEE, MMM d")

const gamePlayedAtValue = ({
  minutesInFuture,
}: {
  minutesInFuture: number
}): string => DateFNS.formatISO(DateFNS.addMinutes(new Date(), minutesInFuture))

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

      describe("when Yes is tapped", () => {
        it("shows a checkmark icon by the players name in the attendance list", async () => {
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
            },
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

      // make the player list items highlight when tapped, like games - test both; fixes some coverage issues
      // show the game scores on the game list page & this details screen - fixes broken tests & lint errors
      // fix broken /games/index tests looking for dates whose labels were broken up - fixes broken tests
      // update expo deps

      describe("when No is tapped", () => {
        it("shows an X icon by the players name in the attendance list", async () => {
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
            },
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
        it("shows an ? icon by the players name in the attendance list", async () => {
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
            },
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
