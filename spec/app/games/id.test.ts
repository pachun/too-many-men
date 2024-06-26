import * as ERTL from "expo-router/testing-library"
import * as DateFNS from "date-fns"
import AsyncStorage from "@react-native-async-storage/async-storage"
import gameFactory from "../../specHelpers/factories/game"
import type { Game } from "types/Game"
import color from "helpers/color"
import mockApi, {
  mockGetGame,
  mockCreateOrUpdatePlayerAttendance,
  mockGetGames,
} from "../../specHelpers/mockApi"
import mockLoggedInPlayer from "../../specHelpers/mockLoggedInPlayer"
import playerFactory from "../../specHelpers/factories/player"
import iosSystemColorWithOtherPlatformAlternative from "helpers/iosSystemColorWithOtherPlatformAlternative"

const gameTime = (game: Game): string =>
  DateFNS.format(DateFNS.parseISO(game.played_at), "h:mm a")

const gameDateWithWeekday = (game: Game): string =>
  DateFNS.format(DateFNS.parseISO(game.played_at), "EEEE, MMM d")

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
      const game = gameFactory({})

      await mockApi({
        mockedRequests: [mockGetGame(game)],
        test: async () => {
          ERTL.renderRouter("src/app", { initialUrl: `/games/${game.id}` })

          await ERTL.waitFor(() => {
            expect(ERTL.screen).toShowTestId("Loading Spinner")
          })
        },
      })
    })

    it("does not show a navigation bar title", async () => {
      const game = gameFactory({})

      await mockApi({
        mockedRequests: [mockGetGame(game)],
        test: async () => {
          ERTL.renderRouter("src/app", { initialUrl: `/games/${game.id}` })

          await ERTL.waitFor(() => {
            expect(ERTL.screen).toHaveNavigationBarTitle("")
          })
        },
      })
    })
  })

  describe("when the game is done loading from the api", () => {
    it("hides the loading spinner", async () => {
      const game = gameFactory({})

      await mockApi({
        mockedRequests: [mockGetGame(game)],
        test: async () => {
          ERTL.renderRouter("src/app", { initialUrl: `/games/${game.id}` })

          await ERTL.waitFor(() => {
            expect(ERTL.screen).not.toShowTestId("Loading Spinner")
          })
        },
      })
    })

    it("sets the navigation bar title to the games date", async () => {
      const game = gameFactory({ played_at: "2024-02-09T02:30:00Z" })

      await mockApi({
        mockedRequests: [mockGetGame(game)],
        test: async () => {
          ERTL.renderRouter("src/app", { initialUrl: `/games/${game.id}` })

          await ERTL.waitFor(() => {
            expect(ERTL.screen).toHaveNavigationBarTitle(
              gameDateWithWeekday(game),
            )
          })
        },
      })
    })

    it("shows the games date", async () => {
      const game = gameFactory({ played_at: "2024-02-09T02:30:00Z" })

      await mockApi({
        mockedRequests: [mockGetGame(game)],
        test: async () => {
          ERTL.renderRouter("src/app", { initialUrl: `/games/${game.id}` })

          await ERTL.waitFor(() => {
            expect(ERTL.screen).toShowText(gameDateWithWeekday(game))
          })
        },
      })
    })

    it("shows the games time", async () => {
      const game = gameFactory({ played_at: "2024-02-09T02:30:00Z" })

      await mockApi({
        mockedRequests: [mockGetGame(game)],
        test: async () => {
          ERTL.renderRouter("src/app", { initialUrl: `/games/${game.id}` })

          await ERTL.waitFor(() => {
            expect(ERTL.screen).toShowText(gameTime(game))
          })
        },
      })
    })

    it("shows the games rink", async () => {
      const game = gameFactory({ rink: "Rink C" })

      await mockApi({
        mockedRequests: [mockGetGame(game)],
        test: async () => {
          ERTL.renderRouter("src/app", { initialUrl: `/games/${game.id}` })

          await ERTL.waitFor(() => {
            expect(ERTL.screen).toShowText("Rink C")
          })
        },
      })
    })

    it("shows the games opponent", async () => {
      const game = gameFactory({ opposing_teams_name: "Scott's Tots" })

      await mockApi({
        mockedRequests: [mockGetGame(game)],
        test: async () => {
          ERTL.renderRouter("src/app", { initialUrl: `/games/${game.id}` })

          await ERTL.waitFor(() => {
            expect(ERTL.screen).toShowText("Scott's Tots")
          })
        },
      })
    })

    it("indicates when the team is the home team", async () => {
      const game = gameFactory({ is_home_team: true })

      await mockApi({
        mockedRequests: [mockGetGame(game)],
        test: async () => {
          ERTL.renderRouter("src/app", { initialUrl: `/games/${game.id}` })

          await ERTL.waitFor(() => {
            expect(ERTL.screen).toShowText("Home")
          })
        },
      })
    })

    it("indicates when the team is the away team", async () => {
      const game = gameFactory({ is_home_team: false })

      await mockApi({
        mockedRequests: [mockGetGame(game)],
        test: async () => {
          ERTL.renderRouter("src/app", { initialUrl: `/games/${game.id}` })

          await ERTL.waitFor(() => {
            expect(ERTL.screen).toShowText("Away")
          })
        },
      })
    })

    it("shows a list of the games players (for attendance tracking purposes)", async () => {
      const game = gameFactory({
        players: [
          { first_name: "Toby", last_name: "Flenderson" },
          { first_name: "Kelly", last_name: "Kapoor" },
          { first_name: "Meredith", last_name: "Palmer" },
        ],
      })

      await mockApi({
        mockedRequests: [mockGetGame(game)],
        test: async () => {
          ERTL.renderRouter("src/app", { initialUrl: `/games/${game.id}` })

          await ERTL.waitFor(() => {
            expect(ERTL.screen).toShowText("Attendance")
            expect(ERTL.screen).toShowText("Toby Flenderson")
            expect(ERTL.screen).toShowText("Kelly Kapoor")
            expect(ERTL.screen).toShowText("Meredith Palmer")
          })
        },
      })
    })

    it("sorts the list of the games players with respondants at the tope (ordered: Yeses, Nos, Maybes, Unanswereds)", async () => {
      const game = gameFactory({
        ids_of_players_who_responded_yes_to_attending: [3],
        ids_of_players_who_responded_no_to_attending: [2],
        ids_of_players_who_responded_maybe_to_attending: [4],
        players: [
          { id: 1, first_name: "Toby", last_name: "Flenderson" },
          { id: 2, first_name: "Kelly", last_name: "Kapoor" },
          { id: 3, first_name: "Meredith", last_name: "Palmer" },
          { id: 4, first_name: "Kevin", last_name: "Malone" },
        ],
      })

      await mockApi({
        mockedRequests: [mockGetGame(game)],
        test: async () => {
          ERTL.renderRouter("src/app", { initialUrl: `/games/${game.id}` })

          await ERTL.waitFor(() => {
            expect(ERTL.screen).not.toShowTestId("Loading Spinner")
          })

          const playerListItems = ERTL.screen.getAllByTestId(
            "Player Attendance List Item",
          )

          expect(ERTL.within(playerListItems[0])).toShowText("Meredith Palmer")
          expect(ERTL.within(playerListItems[1])).toShowText("Kelly Kapoor")
          expect(ERTL.within(playerListItems[2])).toShowText("Kevin Malone")
          expect(ERTL.within(playerListItems[3])).toShowText("Toby Flenderson")
        },
      })
    })

    describe("when the game has already started or is in the past", () => {
      it("does not show an Are You Going To This Game? question with Yes, No, and Maybe options", async () => {
        await mockLoggedInPlayer({})

        const game = gameFactory({
          played_at: gamePlayedAtValue({ minutesInFuture: -1 }),
        })

        await mockApi({
          mockedRequests: [mockGetGame(game)],
          test: async () => {
            ERTL.renderRouter("src/app", { initialUrl: `/games/${game.id}` })

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
          played_at: gamePlayedAtValue({ minutesInFuture: 1 }),
        })

        await mockApi({
          mockedRequests: [mockGetGame(game)],
          test: async () => {
            ERTL.renderRouter("src/app", { initialUrl: `/games/${game.id}` })

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

    describe("when the game is in the future and the player is authenticated", () => {
      it("shows an Are You Going To This Game? question with Yes, No, and Maybe options", async () => {
        await mockLoggedInPlayer({})

        const game = gameFactory({
          played_at: gamePlayedAtValue({ minutesInFuture: 1 }),
        })

        await mockApi({
          mockedRequests: [mockGetGame(game)],
          test: async () => {
            ERTL.renderRouter("src/app", { initialUrl: `/games/${game.id}` })

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
          await mockLoggedInPlayer({})

          const game = gameFactory({
            played_at: gamePlayedAtValue({ secondsInFuture: 1 }),
          })

          await mockApi({
            mockedRequests: [mockGetGame(game)],
            test: async () => {
              ERTL.renderRouter("src/app", { initialUrl: `/games/${game.id}` })

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
        it("selects the Yes radio button", async () => {
          const player = playerFactory({})

          const { playerApiToken } = await mockLoggedInPlayer({
            playerId: player.id,
          })

          const game = gameFactory({
            played_at: gamePlayedAtValue({ minutesInFuture: 1 }),
            players: [player],
          })

          await mockApi({
            mockedRequests: [
              mockGetGame(game),
              mockCreateOrUpdatePlayerAttendance(game, playerApiToken, "Yes"),
            ],
            test: async () => {
              ERTL.renderRouter("src/app", { initialUrl: `/games/${game.id}` })

              await ERTL.waitFor(() => {
                expect(ERTL.screen).not.toShowTestId("Loading Spinner")
              })

              ERTL.fireEvent.press(ERTL.screen.getByText("Yes"))

              await ERTL.waitFor(() => {
                expect(
                  ERTL.screen.getByTestId("Yes Radio Button").props.style
                    .backgroundColor,
                ).toEqual(
                  iosSystemColorWithOtherPlatformAlternative({
                    ios: "systemGreen",
                    otherPlatforms: "limegreen",
                  }),
                )
              })
            },
          })
        })

        it("shows a checkmark icon by the players name in the attendance list", async () => {
          const player = playerFactory({})

          const { playerApiToken } = await mockLoggedInPlayer({
            playerId: player.id,
          })

          const game = gameFactory({
            played_at: gamePlayedAtValue({ minutesInFuture: 1 }),
            players: [player],
          })

          await mockApi({
            mockedRequests: [
              mockGetGame(game),
              mockCreateOrUpdatePlayerAttendance(game, playerApiToken, "Yes"),
            ],
            test: async () => {
              ERTL.renderRouter("src/app", { initialUrl: `/games/${game.id}` })

              await ERTL.waitFor(() => {
                expect(ERTL.screen).not.toShowTestId("Loading Spinner")
              })

              ERTL.fireEvent.press(ERTL.screen.getByText("Yes"))

              await ERTL.waitFor(() => {
                expect(
                  ERTL.within(
                    ERTL.screen.getByTestId(
                      `Player ${player.id} Attendance List Item`,
                    ),
                  ),
                ).toShowTestId("Checkmark Icon")
              })
            },
          })
        })

        it("shows a mini loading spinner while the attendance API request is ongoing", async () => {
          const player = playerFactory({})

          const { playerApiToken } = await mockLoggedInPlayer({
            playerId: player.id,
          })

          const game = gameFactory({
            played_at: gamePlayedAtValue({ minutesInFuture: 1 }),
            players: [player],
          })

          await mockApi({
            mockedRequests: [
              mockGetGame(game),
              mockCreateOrUpdatePlayerAttendance(game, playerApiToken, "Yes"),
            ],
            test: async () => {
              ERTL.renderRouter("src/app", { initialUrl: `/games/${game.id}` })

              await ERTL.waitFor(() => {
                expect(ERTL.screen).not.toShowTestId("Loading Spinner")
              })

              expect(ERTL.screen).not.toShowTestId("Mini Loading Spinner")

              ERTL.fireEvent.press(ERTL.screen.getByText("Yes"))

              await ERTL.waitFor(() => {
                expect(ERTL.screen).toShowTestId("Mini Loading Spinner")
              })

              await ERTL.waitFor(() => {
                expect(ERTL.screen).not.toShowTestId("Mini Loading Spinner")
              })
            },
          })
        })

        it("disables the attendance buttons while the attendance API request is ongoing", async () => {
          const player = playerFactory({})

          const { playerApiToken } = await mockLoggedInPlayer({
            playerId: player.id,
          })

          const game = gameFactory({
            played_at: gamePlayedAtValue({ minutesInFuture: 1 }),
            players: [player],
          })

          await mockApi({
            mockedRequests: [
              mockGetGame(game),
              mockCreateOrUpdatePlayerAttendance(game, playerApiToken, "Yes"),
            ],
            test: async () => {
              ERTL.renderRouter("src/app", { initialUrl: `/games/${game.id}` })

              await ERTL.waitFor(() => {
                expect(ERTL.screen).not.toShowTestId("Loading Spinner")
              })

              ERTL.fireEvent.press(ERTL.screen.getByText("Yes"))
              ERTL.fireEvent.press(ERTL.screen.getByText("No"))
              ERTL.fireEvent.press(ERTL.screen.getByText("Maybe"))

              await ERTL.waitFor(() => {
                expect(ERTL.screen).toShowTestId("Mini Loading Spinner")
              })

              await ERTL.waitFor(() => {
                expect(ERTL.screen).not.toShowTestId("Mini Loading Spinner")
              })

              expect(
                ERTL.screen.getByTestId("Yes Radio Button").props.style
                  .backgroundColor,
              ).toEqual(
                iosSystemColorWithOtherPlatformAlternative({
                  ios: "systemGreen",
                  otherPlatforms: "limegreen",
                }),
              )
            },
          })
        })

        describe("when the attendance API request fails", () => {
          it("shows a Trouble Connecting to the Internet message", async () => {
            const player = playerFactory({})

            const { playerApiToken } = await mockLoggedInPlayer({
              playerId: player.id,
            })

            const game = gameFactory({
              played_at: gamePlayedAtValue({ minutesInFuture: 1 }),
              players: [player],
            })

            await mockApi({
              mockedRequests: [
                mockGetGame(game),
                mockCreateOrUpdatePlayerAttendance(
                  game,
                  playerApiToken,
                  "Yes",
                  "Network Error",
                ),
              ],
              test: async () => {
                ERTL.renderRouter("src/app", {
                  initialUrl: `/games/${game.id}`,
                })

                await ERTL.waitFor(() => {
                  expect(ERTL.screen).not.toShowTestId("Loading Spinner")
                })

                ERTL.fireEvent.press(ERTL.screen.getByText("Yes"))

                await ERTL.waitFor(() => {
                  expect(ERTL.screen).not.toShowTestId("Mini Loading Spinner")
                })

                await ERTL.waitFor(() => {
                  expect(ERTL.screen).toShowText(
                    "Trouble Connecting to the Internet",
                  )
                })
              },
            })
          })

          it("unselects the Yes radio button", async () => {
            const player = playerFactory({})

            const { playerApiToken } = await mockLoggedInPlayer({
              playerId: player.id,
            })

            const game = gameFactory({
              played_at: gamePlayedAtValue({ minutesInFuture: 1 }),
              players: [player],
            })

            await mockApi({
              mockedRequests: [
                mockGetGame(game),
                mockCreateOrUpdatePlayerAttendance(
                  game,
                  playerApiToken,
                  "Yes",
                  "Network Error",
                ),
              ],
              test: async () => {
                ERTL.renderRouter("src/app", {
                  initialUrl: `/games/${game.id}`,
                })

                await ERTL.waitFor(() => {
                  expect(ERTL.screen).not.toShowTestId("Loading Spinner")
                })

                ERTL.fireEvent.press(ERTL.screen.getByText("Yes"))

                await ERTL.waitFor(() => {
                  expect(ERTL.screen).not.toShowTestId("Mini Loading Spinner")
                })

                expect(
                  ERTL.screen.getByTestId("Yes Radio Button").props.style
                    .backgroundColor,
                ).toEqual(undefined)
              },
            })
          })
        })

        describe("when leaving and returning to the game details screen", () => {
          it("remembers the Yes selection", async () => {
            const player = playerFactory({})

            const { playerApiToken } = await mockLoggedInPlayer({
              playerId: player.id,
            })

            const game = gameFactory({
              played_at: gamePlayedAtValue({ minutesInFuture: 1 }),
              players: [player],
            })

            await mockApi({
              mockedRequests: [
                mockGetGames([game]),
                mockCreateOrUpdatePlayerAttendance(game, playerApiToken, "Yes"),
              ],
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

                await ERTL.waitFor(() => {
                  ERTL.fireEvent.press(ERTL.screen.getByTestId("Back Button"))
                })

                await ERTL.waitFor(() => {
                  ERTL.fireEvent.press(
                    ERTL.screen.getByTestId("Game List Item"),
                  )
                })

                expect(
                  ERTL.screen.getByTestId("Yes Radio Button").props.style
                    .backgroundColor,
                ).toEqual(
                  iosSystemColorWithOtherPlatformAlternative({
                    ios: "systemGreen",
                    otherPlatforms: "limegreen",
                  }),
                )
              },
            })
          })
        })

        describe("when leaving the games details screen and entering another games details screen", () => {
          it("does not change the Yes selection on the details screen of the other game", async () => {
            const player = playerFactory({})
            const { playerApiToken } = await mockLoggedInPlayer({
              playerId: player.id,
            })

            const games = [
              gameFactory({
                played_at: gamePlayedAtValue({ minutesInFuture: 30 }),
                players: [player],
              }),
              gameFactory({
                played_at: gamePlayedAtValue({ minutesInFuture: 60 }),
                players: [player],
              }),
            ]

            await mockApi({
              mockedRequests: [
                mockGetGames(games),
                mockCreateOrUpdatePlayerAttendance(
                  games[0],
                  playerApiToken,
                  "Yes",
                ),
              ],
              test: async () => {
                ERTL.renderRouter("src/app", { initialUrl: "/games" })

                await ERTL.waitFor(() => {
                  expect(ERTL.screen).not.toShowTestId("Loading Spinner")
                })

                await ERTL.waitFor(() => {
                  ERTL.fireEvent.press(
                    ERTL.screen.getAllByTestId("Game List Item")[0],
                  )
                })

                await ERTL.waitFor(() => {
                  expect(ERTL.screen).toShowText("Yes")
                })

                ERTL.fireEvent.press(ERTL.screen.getByText("Yes"))

                await ERTL.waitFor(() => {
                  ERTL.fireEvent.press(ERTL.screen.getByTestId("Back Button"))
                })

                await ERTL.waitFor(() => {
                  ERTL.fireEvent.press(
                    ERTL.screen.getAllByTestId("Game List Item")[1],
                  )
                })

                expect(
                  ERTL.screen.getByTestId("Yes Radio Button").props.style
                    .backgroundColor,
                ).not.toEqual(
                  iosSystemColorWithOtherPlatformAlternative({
                    ios: "systemGreen",
                    otherPlatforms: "limegreen",
                  }),
                )
              },
            })
          })
        })

        describe("when Yes is tapped a second time in a row", () => {
          it("does not send a duplicate API request", async () => {
            const player = playerFactory({})

            const { playerApiToken } = await mockLoggedInPlayer({
              playerId: player.id,
            })

            const game = gameFactory({
              played_at: gamePlayedAtValue({ minutesInFuture: 1 }),
              players: [player],
            })

            await mockApi({
              mockedRequests: [
                mockGetGame(game),
                mockCreateOrUpdatePlayerAttendance(game, playerApiToken, "Yes"),
              ],
              test: async () => {
                ERTL.renderRouter("src/app", {
                  initialUrl: `/games/${game.id}`,
                })

                await ERTL.waitFor(() => {
                  expect(ERTL.screen).not.toShowTestId("Loading Spinner")
                })

                ERTL.fireEvent.press(ERTL.screen.getByText("Yes"))

                await ERTL.waitFor(() => {
                  expect(ERTL.screen).not.toShowTestId("Loading Spinner")
                })

                ERTL.fireEvent.press(ERTL.screen.getByText("Yes"))

                await ERTL.waitFor(() => {
                  expect(ERTL.screen).not.toShowTestId("Loading Spinner")
                })
              },
            })
          })
        })

        describe("when No is tapped after tapping Yes", () => {
          it("removes the checkmark icon by the players name in the attendance list", async () => {
            const player = playerFactory({})

            const { playerApiToken } = await mockLoggedInPlayer({
              playerId: player.id,
            })

            const game = gameFactory({
              played_at: gamePlayedAtValue({ minutesInFuture: 1 }),
              players: [player],
            })

            await mockApi({
              mockedRequests: [
                mockGetGame(game),
                mockCreateOrUpdatePlayerAttendance(game, playerApiToken, "Yes"),
                mockCreateOrUpdatePlayerAttendance(game, playerApiToken, "No"),
              ],
              test: async () => {
                ERTL.renderRouter("src/app", {
                  initialUrl: `/games/${game.id}`,
                })

                await ERTL.waitFor(() => {
                  expect(ERTL.screen).not.toShowTestId("Loading Spinner")
                })

                ERTL.fireEvent.press(ERTL.screen.getByText("Yes"))

                await ERTL.waitFor(() => {
                  expect(
                    ERTL.within(
                      ERTL.screen.getByTestId(
                        `Player ${player.id} Attendance List Item`,
                      ),
                    ),
                  ).toShowTestId("Checkmark Icon")
                })

                ERTL.fireEvent.press(ERTL.screen.getByText("No"))

                await ERTL.waitFor(() => {
                  expect(
                    ERTL.within(
                      ERTL.screen.getByTestId(
                        `Player ${player.id} Attendance List Item`,
                      ),
                    ),
                  ).not.toShowTestId("Checkmark Icon")
                })
              },
            })
          })

          describe("when the attendance API request fails", () => {
            it("shows a Trouble Connecting to the Internet message", async () => {
              const player = playerFactory({})

              const { playerApiToken } = await mockLoggedInPlayer({
                playerId: player.id,
              })

              const game = gameFactory({
                played_at: gamePlayedAtValue({ minutesInFuture: 1 }),
                players: [player],
              })

              await mockApi({
                mockedRequests: [
                  mockGetGame(game),
                  mockCreateOrUpdatePlayerAttendance(
                    game,
                    playerApiToken,
                    "Yes",
                  ),
                  mockCreateOrUpdatePlayerAttendance(
                    game,
                    playerApiToken,
                    "No",
                    "Network Error",
                  ),
                ],
                test: async () => {
                  ERTL.renderRouter("src/app", {
                    initialUrl: `/games/${game.id}`,
                  })

                  await ERTL.waitFor(() => {
                    expect(ERTL.screen).not.toShowTestId("Loading Spinner")
                  })

                  ERTL.fireEvent.press(ERTL.screen.getByText("Yes"))

                  await ERTL.waitFor(() => {
                    expect(ERTL.screen).not.toShowTestId("Mini Loading Spinner")
                  })

                  ERTL.fireEvent.press(ERTL.screen.getByText("No"))

                  await ERTL.waitFor(() => {
                    expect(ERTL.screen).not.toShowTestId("Mini Loading Spinner")
                  })

                  await ERTL.waitFor(() => {
                    expect(ERTL.screen).toShowText(
                      "Trouble Connecting to the Internet",
                    )
                  })
                },
              })
            })

            it("unselects the No radio button and reselects the Yes radio button", async () => {
              const player = playerFactory({})

              const { playerApiToken } = await mockLoggedInPlayer({
                playerId: player.id,
              })

              const game = gameFactory({
                played_at: gamePlayedAtValue({ minutesInFuture: 1 }),
                players: [player],
              })

              await mockApi({
                mockedRequests: [
                  mockGetGame(game),
                  mockCreateOrUpdatePlayerAttendance(
                    game,
                    playerApiToken,
                    "Yes",
                  ),
                  mockCreateOrUpdatePlayerAttendance(
                    game,
                    playerApiToken,
                    "No",
                    "Network Error",
                  ),
                ],
                test: async () => {
                  ERTL.renderRouter("src/app", {
                    initialUrl: `/games/${game.id}`,
                  })

                  await ERTL.waitFor(() => {
                    expect(ERTL.screen).not.toShowTestId("Loading Spinner")
                  })

                  ERTL.fireEvent.press(ERTL.screen.getByText("Yes"))

                  await ERTL.waitFor(() => {
                    expect(ERTL.screen).not.toShowTestId("Mini Loading Spinner")
                  })

                  ERTL.fireEvent.press(ERTL.screen.getByText("No"))

                  await ERTL.waitFor(() => {
                    expect(ERTL.screen).not.toShowTestId("Mini Loading Spinner")
                  })

                  expect(
                    ERTL.screen.getByTestId("No Radio Button").props.style
                      .backgroundColor,
                  ).toEqual(undefined)

                  expect(
                    ERTL.screen.getByTestId("Yes Radio Button").props.style
                      .backgroundColor,
                  ).toEqual(
                    iosSystemColorWithOtherPlatformAlternative({
                      ios: "systemGreen",
                      otherPlatforms: "limegreen",
                    }),
                  )
                },
              })
            })
          })
        })

        describe("when Maybe is tapped after tapping Yes", () => {
          it("removes the checkmark icon by the players name in the attendance list", async () => {
            const player = playerFactory({})

            const { playerApiToken } = await mockLoggedInPlayer({
              playerId: player.id,
            })

            const game = gameFactory({
              played_at: gamePlayedAtValue({ minutesInFuture: 1 }),
              players: [player],
            })

            await mockApi({
              mockedRequests: [
                mockGetGame(game),
                mockCreateOrUpdatePlayerAttendance(game, playerApiToken, "Yes"),
                mockCreateOrUpdatePlayerAttendance(
                  game,
                  playerApiToken,
                  "Maybe",
                ),
              ],
              test: async () => {
                ERTL.renderRouter("src/app", {
                  initialUrl: `/games/${game.id}`,
                })

                await ERTL.waitFor(() => {
                  expect(ERTL.screen).not.toShowTestId("Loading Spinner")
                })

                ERTL.fireEvent.press(ERTL.screen.getByText("Yes"))

                await ERTL.waitFor(() => {
                  expect(
                    ERTL.within(
                      ERTL.screen.getByTestId(
                        `Player ${player.id} Attendance List Item`,
                      ),
                    ),
                  ).toShowTestId("Checkmark Icon")
                })

                ERTL.fireEvent.press(ERTL.screen.getByText("Maybe"))

                await ERTL.waitFor(() => {
                  expect(
                    ERTL.within(
                      ERTL.screen.getByTestId(
                        `Player ${player.id} Attendance List Item`,
                      ),
                    ),
                  ).not.toShowTestId("Checkmark Icon")
                })
              },
            })
          })

          describe("when the attendance API request fails", () => {
            it("shows a Trouble Connecting to the Internet message", async () => {
              const player = playerFactory({})

              const { playerApiToken } = await mockLoggedInPlayer({
                playerId: player.id,
              })

              const game = gameFactory({
                played_at: gamePlayedAtValue({ minutesInFuture: 1 }),
                players: [player],
              })

              await mockApi({
                mockedRequests: [
                  mockGetGame(game),
                  mockCreateOrUpdatePlayerAttendance(
                    game,
                    playerApiToken,
                    "Yes",
                  ),
                  mockCreateOrUpdatePlayerAttendance(
                    game,
                    playerApiToken,
                    "Maybe",
                    "Network Error",
                  ),
                ],
                test: async () => {
                  ERTL.renderRouter("src/app", {
                    initialUrl: `/games/${game.id}`,
                  })

                  await ERTL.waitFor(() => {
                    expect(ERTL.screen).not.toShowTestId("Loading Spinner")
                  })

                  ERTL.fireEvent.press(ERTL.screen.getByText("Yes"))

                  await ERTL.waitFor(() => {
                    expect(ERTL.screen).not.toShowTestId("Mini Loading Spinner")
                  })

                  ERTL.fireEvent.press(ERTL.screen.getByText("Maybe"))

                  await ERTL.waitFor(() => {
                    expect(ERTL.screen).not.toShowTestId("Mini Loading Spinner")
                  })

                  await ERTL.waitFor(() => {
                    expect(ERTL.screen).toShowText(
                      "Trouble Connecting to the Internet",
                    )
                  })
                },
              })
            })

            it("unselects the Maybe radio button and reselects the Yes radio button", async () => {
              const player = playerFactory({})

              const { playerApiToken } = await mockLoggedInPlayer({
                playerId: player.id,
              })

              const game = gameFactory({
                played_at: gamePlayedAtValue({ minutesInFuture: 1 }),
                players: [player],
              })

              await mockApi({
                mockedRequests: [
                  mockGetGame(game),
                  mockCreateOrUpdatePlayerAttendance(
                    game,
                    playerApiToken,
                    "Yes",
                  ),
                  mockCreateOrUpdatePlayerAttendance(
                    game,
                    playerApiToken,
                    "Maybe",
                    "Network Error",
                  ),
                ],
                test: async () => {
                  ERTL.renderRouter("src/app", {
                    initialUrl: `/games/${game.id}`,
                  })

                  await ERTL.waitFor(() => {
                    expect(ERTL.screen).not.toShowTestId("Loading Spinner")
                  })

                  ERTL.fireEvent.press(ERTL.screen.getByText("Yes"))

                  await ERTL.waitFor(() => {
                    expect(ERTL.screen).not.toShowTestId("Mini Loading Spinner")
                  })

                  ERTL.fireEvent.press(ERTL.screen.getByText("Maybe"))

                  await ERTL.waitFor(() => {
                    expect(ERTL.screen).not.toShowTestId("Mini Loading Spinner")
                  })

                  expect(
                    ERTL.screen.getByTestId("Maybe Radio Button").props.style
                      .backgroundColor,
                  ).toEqual(undefined)

                  expect(
                    ERTL.screen.getByTestId("Yes Radio Button").props.style
                      .backgroundColor,
                  ).toEqual(
                    iosSystemColorWithOtherPlatformAlternative({
                      ios: "systemGreen",
                      otherPlatforms: "limegreen",
                    }),
                  )
                },
              })
            })
          })
        })
      })

      describe("when No is tapped", () => {
        it("selects the No radio button", async () => {
          const player = playerFactory({})

          const { playerApiToken } = await mockLoggedInPlayer({
            playerId: player.id,
          })

          const game = gameFactory({
            played_at: gamePlayedAtValue({ minutesInFuture: 1 }),
            players: [player],
          })

          await mockApi({
            mockedRequests: [
              mockGetGame(game),
              mockCreateOrUpdatePlayerAttendance(game, playerApiToken, "No"),
            ],
            test: async () => {
              ERTL.renderRouter("src/app", { initialUrl: `/games/${game.id}` })

              await ERTL.waitFor(() => {
                expect(ERTL.screen).not.toShowTestId("Loading Spinner")
              })

              ERTL.fireEvent.press(ERTL.screen.getByText("No"))

              await ERTL.waitFor(() => {
                expect(
                  ERTL.screen.getByTestId("No Radio Button").props.style
                    .backgroundColor,
                ).toEqual(color("red"))
              })
            },
          })
        })

        it("shows an X icon by the players name in the attendance list", async () => {
          const player = playerFactory({})

          const { playerApiToken } = await mockLoggedInPlayer({
            playerId: player.id,
          })

          const game = gameFactory({
            played_at: gamePlayedAtValue({ minutesInFuture: 1 }),
            players: [player],
          })

          await mockApi({
            mockedRequests: [
              mockGetGame(game),
              mockCreateOrUpdatePlayerAttendance(game, playerApiToken, "No"),
            ],
            test: async () => {
              ERTL.renderRouter("src/app", { initialUrl: `/games/${game.id}` })

              await ERTL.waitFor(() => {
                expect(ERTL.screen).not.toShowTestId("Loading Spinner")
              })

              ERTL.fireEvent.press(ERTL.screen.getByText("No"))

              await ERTL.waitFor(() => {
                expect(
                  ERTL.within(
                    ERTL.screen.getByTestId(
                      `Player ${player.id} Attendance List Item`,
                    ),
                  ),
                ).toShowTestId("X Icon")
              })
            },
          })
        })

        it("shows a mini loading spinner while the attendance API request is ongoing", async () => {
          const player = playerFactory({})

          const { playerApiToken } = await mockLoggedInPlayer({
            playerId: player.id,
          })

          const game = gameFactory({
            played_at: gamePlayedAtValue({ minutesInFuture: 1 }),
            players: [player],
          })

          await mockApi({
            mockedRequests: [
              mockGetGame(game),
              mockCreateOrUpdatePlayerAttendance(game, playerApiToken, "No"),
            ],
            test: async () => {
              ERTL.renderRouter("src/app", { initialUrl: `/games/${game.id}` })

              await ERTL.waitFor(() => {
                expect(ERTL.screen).not.toShowTestId("Loading Spinner")
              })

              expect(ERTL.screen).not.toShowTestId("Mini Loading Spinner")

              ERTL.fireEvent.press(ERTL.screen.getByText("No"))

              await ERTL.waitFor(() => {
                expect(ERTL.screen).toShowTestId("Mini Loading Spinner")
              })

              await ERTL.waitFor(() => {
                expect(ERTL.screen).not.toShowTestId("Mini Loading Spinner")
              })
            },
          })
        })

        it("disables the attendance buttons while the attendance API request is ongoing", async () => {
          const player = playerFactory({})

          const { playerApiToken } = await mockLoggedInPlayer({
            playerId: player.id,
          })

          const game = gameFactory({
            played_at: gamePlayedAtValue({ minutesInFuture: 1 }),
            players: [player],
          })

          await mockApi({
            mockedRequests: [
              mockGetGame(game),
              mockCreateOrUpdatePlayerAttendance(game, playerApiToken, "No"),
            ],
            test: async () => {
              ERTL.renderRouter("src/app", { initialUrl: `/games/${game.id}` })

              await ERTL.waitFor(() => {
                expect(ERTL.screen).not.toShowTestId("Loading Spinner")
              })

              ERTL.fireEvent.press(ERTL.screen.getByText("No"))
              ERTL.fireEvent.press(ERTL.screen.getByText("Yes"))
              ERTL.fireEvent.press(ERTL.screen.getByText("Maybe"))

              await ERTL.waitFor(() => {
                expect(ERTL.screen).toShowTestId("Mini Loading Spinner")
              })

              await ERTL.waitFor(() => {
                expect(ERTL.screen).not.toShowTestId("Mini Loading Spinner")
              })

              expect(
                ERTL.screen.getByTestId("No Radio Button").props.style
                  .backgroundColor,
              ).toEqual(color("red"))
            },
          })
        })

        describe("when the attendance API request fails", () => {
          it("shows a Trouble Connecting to the Internet message", async () => {
            const player = playerFactory({})

            const { playerApiToken } = await mockLoggedInPlayer({
              playerId: player.id,
            })

            const game = gameFactory({
              played_at: gamePlayedAtValue({ minutesInFuture: 1 }),
              players: [player],
            })

            await mockApi({
              mockedRequests: [
                mockGetGame(game),
                mockCreateOrUpdatePlayerAttendance(
                  game,
                  playerApiToken,
                  "No",
                  "Network Error",
                ),
              ],
              test: async () => {
                ERTL.renderRouter("src/app", {
                  initialUrl: `/games/${game.id}`,
                })

                await ERTL.waitFor(() => {
                  expect(ERTL.screen).not.toShowTestId("Loading Spinner")
                })

                ERTL.fireEvent.press(ERTL.screen.getByText("No"))

                await ERTL.waitFor(() => {
                  expect(ERTL.screen).not.toShowTestId("Mini Loading Spinner")
                })

                await ERTL.waitFor(() => {
                  expect(ERTL.screen).toShowText(
                    "Trouble Connecting to the Internet",
                  )
                })
              },
            })
          })

          it("unselects the No radio button", async () => {
            const player = playerFactory({})

            const { playerApiToken } = await mockLoggedInPlayer({
              playerId: player.id,
            })

            const game = gameFactory({
              played_at: gamePlayedAtValue({ minutesInFuture: 1 }),
              players: [player],
            })

            await mockApi({
              mockedRequests: [
                mockGetGame(game),
                mockCreateOrUpdatePlayerAttendance(
                  game,
                  playerApiToken,
                  "No",
                  "Network Error",
                ),
              ],
              test: async () => {
                ERTL.renderRouter("src/app", {
                  initialUrl: `/games/${game.id}`,
                })

                await ERTL.waitFor(() => {
                  expect(ERTL.screen).not.toShowTestId("Loading Spinner")
                })

                ERTL.fireEvent.press(ERTL.screen.getByText("No"))

                await ERTL.waitFor(() => {
                  expect(ERTL.screen).not.toShowTestId("Mini Loading Spinner")
                })

                expect(
                  ERTL.screen.getByTestId("No Radio Button").props.style
                    .backgroundColor,
                ).toEqual(undefined)
              },
            })
          })
        })

        describe("when leaving and returning to the game details screen", () => {
          it("remembers the No selection", async () => {
            const player = playerFactory({})

            const { playerApiToken } = await mockLoggedInPlayer({
              playerId: player.id,
            })

            const game = gameFactory({
              played_at: gamePlayedAtValue({ minutesInFuture: 1 }),
              players: [player],
            })

            await mockApi({
              mockedRequests: [
                mockGetGames([game]),
                mockCreateOrUpdatePlayerAttendance(game, playerApiToken, "No"),
              ],
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

                await ERTL.waitFor(() => {
                  ERTL.fireEvent.press(ERTL.screen.getByTestId("Back Button"))
                })

                await ERTL.waitFor(() => {
                  ERTL.fireEvent.press(
                    ERTL.screen.getByTestId("Game List Item"),
                  )
                })

                expect(
                  ERTL.screen.getByTestId("No Radio Button").props.style
                    .backgroundColor,
                ).toEqual(color("red"))
              },
            })
          })
        })

        describe("when leaving the games details screen and entering another games details screen", () => {
          it("does not change the No selection on the details screen of the other game", async () => {
            const player = playerFactory({})
            const { playerApiToken } = await mockLoggedInPlayer({
              playerId: player.id,
            })

            const games = [
              gameFactory({
                played_at: gamePlayedAtValue({ minutesInFuture: 30 }),
                players: [player],
              }),
              gameFactory({
                played_at: gamePlayedAtValue({ minutesInFuture: 60 }),
                players: [player],
              }),
            ]

            await mockApi({
              mockedRequests: [
                mockGetGames(games),
                mockCreateOrUpdatePlayerAttendance(
                  games[0],
                  playerApiToken,
                  "No",
                ),
              ],
              test: async () => {
                ERTL.renderRouter("src/app", { initialUrl: "/games" })

                await ERTL.waitFor(() => {
                  expect(ERTL.screen).not.toShowTestId("Loading Spinner")
                })

                await ERTL.waitFor(() => {
                  ERTL.fireEvent.press(
                    ERTL.screen.getAllByTestId("Game List Item")[0],
                  )
                })

                await ERTL.waitFor(() => {
                  expect(ERTL.screen).toShowText("No")
                })

                ERTL.fireEvent.press(ERTL.screen.getByText("No"))

                await ERTL.waitFor(() => {
                  ERTL.fireEvent.press(ERTL.screen.getByTestId("Back Button"))
                })

                await ERTL.waitFor(() => {
                  ERTL.fireEvent.press(
                    ERTL.screen.getAllByTestId("Game List Item")[1],
                  )
                })

                expect(
                  ERTL.screen.getByTestId("No Radio Button").props.style
                    .backgroundColor,
                ).not.toEqual(color("red"))
              },
            })
          })
        })

        describe("when No is tapped a second time in a row", () => {
          it("does not send a duplicate API request", async () => {
            const player = playerFactory({})

            const { playerApiToken } = await mockLoggedInPlayer({
              playerId: player.id,
            })

            const game = gameFactory({
              played_at: gamePlayedAtValue({ minutesInFuture: 1 }),
              players: [player],
            })

            await mockApi({
              mockedRequests: [
                mockGetGame(game),
                mockCreateOrUpdatePlayerAttendance(game, playerApiToken, "No"),
              ],
              test: async () => {
                ERTL.renderRouter("src/app", {
                  initialUrl: `/games/${game.id}`,
                })

                await ERTL.waitFor(() => {
                  expect(ERTL.screen).not.toShowTestId("Loading Spinner")
                })

                ERTL.fireEvent.press(ERTL.screen.getByText("No"))

                await ERTL.waitFor(() => {
                  expect(ERTL.screen).not.toShowTestId("Loading Spinner")
                })

                ERTL.fireEvent.press(ERTL.screen.getByText("No"))

                await ERTL.waitFor(() => {
                  expect(ERTL.screen).not.toShowTestId("Loading Spinner")
                })
              },
            })
          })
        })

        describe("when Yes is tapped after tapping No", () => {
          it("removes the X icon by the players name in the attendance list", async () => {
            const player = playerFactory({})

            const { playerApiToken } = await mockLoggedInPlayer({
              playerId: player.id,
            })

            const game = gameFactory({
              played_at: gamePlayedAtValue({ minutesInFuture: 1 }),
              players: [player],
            })

            await mockApi({
              mockedRequests: [
                mockGetGame(game),
                mockCreateOrUpdatePlayerAttendance(game, playerApiToken, "No"),
                mockCreateOrUpdatePlayerAttendance(game, playerApiToken, "Yes"),
              ],
              test: async () => {
                ERTL.renderRouter("src/app", {
                  initialUrl: `/games/${game.id}`,
                })

                await ERTL.waitFor(() => {
                  expect(ERTL.screen).not.toShowTestId("Loading Spinner")
                })

                ERTL.fireEvent.press(ERTL.screen.getByText("No"))

                await ERTL.waitFor(() => {
                  expect(
                    ERTL.within(
                      ERTL.screen.getByTestId(
                        `Player ${player.id} Attendance List Item`,
                      ),
                    ),
                  ).toShowTestId("X Icon")
                })

                ERTL.fireEvent.press(ERTL.screen.getByText("Yes"))

                await ERTL.waitFor(() => {
                  expect(
                    ERTL.within(
                      ERTL.screen.getByTestId(
                        `Player ${player.id} Attendance List Item`,
                      ),
                    ),
                  ).not.toShowTestId("X Icon")
                })
              },
            })
          })

          describe("when the attendance API request fails", () => {
            it("shows a Trouble Connecting to the Internet message", async () => {
              const player = playerFactory({})

              const { playerApiToken } = await mockLoggedInPlayer({
                playerId: player.id,
              })

              const game = gameFactory({
                played_at: gamePlayedAtValue({ minutesInFuture: 1 }),
                players: [player],
              })

              await mockApi({
                mockedRequests: [
                  mockGetGame(game),
                  mockCreateOrUpdatePlayerAttendance(
                    game,
                    playerApiToken,
                    "No",
                  ),
                  mockCreateOrUpdatePlayerAttendance(
                    game,
                    playerApiToken,
                    "Yes",
                    "Network Error",
                  ),
                ],
                test: async () => {
                  ERTL.renderRouter("src/app", {
                    initialUrl: `/games/${game.id}`,
                  })

                  await ERTL.waitFor(() => {
                    expect(ERTL.screen).not.toShowTestId("Loading Spinner")
                  })

                  ERTL.fireEvent.press(ERTL.screen.getByText("No"))

                  await ERTL.waitFor(() => {
                    expect(ERTL.screen).not.toShowTestId("Mini Loading Spinner")
                  })

                  ERTL.fireEvent.press(ERTL.screen.getByText("Yes"))

                  await ERTL.waitFor(() => {
                    expect(ERTL.screen).not.toShowTestId("Mini Loading Spinner")
                  })

                  await ERTL.waitFor(() => {
                    expect(ERTL.screen).toShowText(
                      "Trouble Connecting to the Internet",
                    )
                  })
                },
              })
            })

            it("unselects the Yes radio button and reselects the No radio button", async () => {
              const player = playerFactory({})

              const { playerApiToken } = await mockLoggedInPlayer({
                playerId: player.id,
              })

              const game = gameFactory({
                played_at: gamePlayedAtValue({ minutesInFuture: 1 }),
                players: [player],
              })

              await mockApi({
                mockedRequests: [
                  mockGetGame(game),
                  mockCreateOrUpdatePlayerAttendance(
                    game,
                    playerApiToken,
                    "No",
                  ),
                  mockCreateOrUpdatePlayerAttendance(
                    game,
                    playerApiToken,
                    "Yes",
                    "Network Error",
                  ),
                ],
                test: async () => {
                  ERTL.renderRouter("src/app", {
                    initialUrl: `/games/${game.id}`,
                  })

                  await ERTL.waitFor(() => {
                    expect(ERTL.screen).not.toShowTestId("Loading Spinner")
                  })

                  ERTL.fireEvent.press(ERTL.screen.getByText("No"))

                  await ERTL.waitFor(() => {
                    expect(ERTL.screen).not.toShowTestId("Mini Loading Spinner")
                  })

                  ERTL.fireEvent.press(ERTL.screen.getByText("Yes"))

                  await ERTL.waitFor(() => {
                    expect(ERTL.screen).not.toShowTestId("Mini Loading Spinner")
                  })

                  expect(
                    ERTL.screen.getByTestId("Yes Radio Button").props.style
                      .backgroundColor,
                  ).toEqual(undefined)

                  expect(
                    ERTL.screen.getByTestId("No Radio Button").props.style
                      .backgroundColor,
                  ).toEqual(color("red"))
                },
              })
            })
          })
        })

        describe("when Maybe is tapped after tapping No", () => {
          it("removes the X icon by the players name in the attendance list", async () => {
            const player = playerFactory({})

            const { playerApiToken } = await mockLoggedInPlayer({
              playerId: player.id,
            })

            const game = gameFactory({
              played_at: gamePlayedAtValue({ minutesInFuture: 1 }),
              players: [player],
            })

            await mockApi({
              mockedRequests: [
                mockGetGame(game),
                mockCreateOrUpdatePlayerAttendance(game, playerApiToken, "No"),
                mockCreateOrUpdatePlayerAttendance(
                  game,
                  playerApiToken,
                  "Maybe",
                ),
              ],
              test: async () => {
                ERTL.renderRouter("src/app", {
                  initialUrl: `/games/${game.id}`,
                })

                await ERTL.waitFor(() => {
                  expect(ERTL.screen).not.toShowTestId("Loading Spinner")
                })

                ERTL.fireEvent.press(ERTL.screen.getByText("No"))

                await ERTL.waitFor(() => {
                  expect(
                    ERTL.within(
                      ERTL.screen.getByTestId(
                        `Player ${player.id} Attendance List Item`,
                      ),
                    ),
                  ).toShowTestId("X Icon")
                })

                ERTL.fireEvent.press(ERTL.screen.getByText("Maybe"))

                await ERTL.waitFor(() => {
                  expect(
                    ERTL.within(
                      ERTL.screen.getByTestId(
                        `Player ${player.id} Attendance List Item`,
                      ),
                    ),
                  ).not.toShowTestId("X Icon")
                })
              },
            })
          })

          describe("when the attendance API request fails", () => {
            it("shows a Trouble Connecting to the Internet message", async () => {
              const player = playerFactory({})

              const { playerApiToken } = await mockLoggedInPlayer({
                playerId: player.id,
              })

              const game = gameFactory({
                played_at: gamePlayedAtValue({ minutesInFuture: 1 }),
                players: [player],
              })

              await mockApi({
                mockedRequests: [
                  mockGetGame(game),
                  mockCreateOrUpdatePlayerAttendance(
                    game,
                    playerApiToken,
                    "No",
                  ),
                  mockCreateOrUpdatePlayerAttendance(
                    game,
                    playerApiToken,
                    "Maybe",
                    "Network Error",
                  ),
                ],
                test: async () => {
                  ERTL.renderRouter("src/app", {
                    initialUrl: `/games/${game.id}`,
                  })

                  await ERTL.waitFor(() => {
                    expect(ERTL.screen).not.toShowTestId("Loading Spinner")
                  })

                  ERTL.fireEvent.press(ERTL.screen.getByText("No"))

                  await ERTL.waitFor(() => {
                    expect(ERTL.screen).not.toShowTestId("Mini Loading Spinner")
                  })

                  ERTL.fireEvent.press(ERTL.screen.getByText("Maybe"))

                  await ERTL.waitFor(() => {
                    expect(ERTL.screen).not.toShowTestId("Mini Loading Spinner")
                  })

                  await ERTL.waitFor(() => {
                    expect(ERTL.screen).toShowText(
                      "Trouble Connecting to the Internet",
                    )
                  })
                },
              })
            })

            it("unselects the Maybe radio button and reselects the No radio button", async () => {
              const player = playerFactory({})

              const { playerApiToken } = await mockLoggedInPlayer({
                playerId: player.id,
              })

              const game = gameFactory({
                played_at: gamePlayedAtValue({ minutesInFuture: 1 }),
                players: [player],
              })

              await mockApi({
                mockedRequests: [
                  mockGetGame(game),
                  mockCreateOrUpdatePlayerAttendance(
                    game,
                    playerApiToken,
                    "No",
                  ),
                  mockCreateOrUpdatePlayerAttendance(
                    game,
                    playerApiToken,
                    "Maybe",
                    "Network Error",
                  ),
                ],
                test: async () => {
                  ERTL.renderRouter("src/app", {
                    initialUrl: `/games/${game.id}`,
                  })

                  await ERTL.waitFor(() => {
                    expect(ERTL.screen).not.toShowTestId("Loading Spinner")
                  })

                  ERTL.fireEvent.press(ERTL.screen.getByText("No"))

                  await ERTL.waitFor(() => {
                    expect(ERTL.screen).not.toShowTestId("Mini Loading Spinner")
                  })

                  ERTL.fireEvent.press(ERTL.screen.getByText("Maybe"))

                  await ERTL.waitFor(() => {
                    expect(ERTL.screen).not.toShowTestId("Mini Loading Spinner")
                  })

                  expect(
                    ERTL.screen.getByTestId("Maybe Radio Button").props.style
                      .backgroundColor,
                  ).toEqual(undefined)

                  expect(
                    ERTL.screen.getByTestId("No Radio Button").props.style
                      .backgroundColor,
                  ).toEqual(color("red"))
                },
              })
            })
          })
        })
      })

      describe("when Maybe is tapped", () => {
        it("selects the Maybe radio button", async () => {
          const player = playerFactory({})

          const { playerApiToken } = await mockLoggedInPlayer({
            playerId: player.id,
          })

          const game = gameFactory({
            played_at: gamePlayedAtValue({ minutesInFuture: 1 }),
            players: [player],
          })

          await mockApi({
            mockedRequests: [
              mockGetGame(game),
              mockCreateOrUpdatePlayerAttendance(game, playerApiToken, "Maybe"),
            ],
            test: async () => {
              ERTL.renderRouter("src/app", { initialUrl: `/games/${game.id}` })

              await ERTL.waitFor(() => {
                expect(ERTL.screen).not.toShowTestId("Loading Spinner")
              })

              ERTL.fireEvent.press(ERTL.screen.getByText("Maybe"))

              await ERTL.waitFor(() => {
                expect(
                  ERTL.screen.getByTestId("Maybe Radio Button").props.style
                    .backgroundColor,
                ).toEqual(
                  iosSystemColorWithOtherPlatformAlternative({
                    ios: "systemYellow",
                    otherPlatforms: "#ffcc02",
                  }),
                )
              })
            },
          })
        })

        it("shows a ? icon by the players name in the attendance list", async () => {
          const player = playerFactory({})

          const { playerApiToken } = await mockLoggedInPlayer({
            playerId: player.id,
          })

          const game = gameFactory({
            played_at: gamePlayedAtValue({ minutesInFuture: 1 }),
            players: [player],
          })

          await mockApi({
            mockedRequests: [
              mockGetGame(game),
              mockCreateOrUpdatePlayerAttendance(game, playerApiToken, "Maybe"),
            ],
            test: async () => {
              ERTL.renderRouter("src/app", { initialUrl: `/games/${game.id}` })

              await ERTL.waitFor(() => {
                expect(ERTL.screen).not.toShowTestId("Loading Spinner")
              })

              ERTL.fireEvent.press(ERTL.screen.getByText("Maybe"))

              await ERTL.waitFor(() => {
                expect(
                  ERTL.within(
                    ERTL.screen.getByTestId(
                      `Player ${player.id} Attendance List Item`,
                    ),
                  ),
                ).toShowTestId("? Icon")
              })
            },
          })
        })

        it("shows a mini loading spinner while the attendance API request is ongoing", async () => {
          const player = playerFactory({})

          const { playerApiToken } = await mockLoggedInPlayer({
            playerId: player.id,
          })

          const game = gameFactory({
            played_at: gamePlayedAtValue({ minutesInFuture: 1 }),
            players: [player],
          })

          await mockApi({
            mockedRequests: [
              mockGetGame(game),
              mockCreateOrUpdatePlayerAttendance(game, playerApiToken, "Maybe"),
            ],
            test: async () => {
              ERTL.renderRouter("src/app", { initialUrl: `/games/${game.id}` })

              await ERTL.waitFor(() => {
                expect(ERTL.screen).not.toShowTestId("Loading Spinner")
              })

              expect(ERTL.screen).not.toShowTestId("Mini Loading Spinner")

              ERTL.fireEvent.press(ERTL.screen.getByText("Maybe"))

              await ERTL.waitFor(() => {
                expect(ERTL.screen).toShowTestId("Mini Loading Spinner")
              })

              await ERTL.waitFor(() => {
                expect(ERTL.screen).not.toShowTestId("Mini Loading Spinner")
              })
            },
          })
        })

        it("disables the attendance buttons while the attendance API request is ongoing", async () => {
          const player = playerFactory({})

          const { playerApiToken } = await mockLoggedInPlayer({
            playerId: player.id,
          })

          const game = gameFactory({
            played_at: gamePlayedAtValue({ minutesInFuture: 1 }),
            players: [player],
          })

          await mockApi({
            mockedRequests: [
              mockGetGame(game),
              mockCreateOrUpdatePlayerAttendance(game, playerApiToken, "Maybe"),
            ],
            test: async () => {
              ERTL.renderRouter("src/app", { initialUrl: `/games/${game.id}` })

              await ERTL.waitFor(() => {
                expect(ERTL.screen).not.toShowTestId("Loading Spinner")
              })

              ERTL.fireEvent.press(ERTL.screen.getByText("Maybe"))
              ERTL.fireEvent.press(ERTL.screen.getByText("Yes"))
              ERTL.fireEvent.press(ERTL.screen.getByText("No"))

              await ERTL.waitFor(() => {
                expect(ERTL.screen).toShowTestId("Mini Loading Spinner")
              })

              await ERTL.waitFor(() => {
                expect(ERTL.screen).not.toShowTestId("Mini Loading Spinner")
              })

              expect(
                ERTL.screen.getByTestId("Maybe Radio Button").props.style
                  .backgroundColor,
              ).toEqual(
                iosSystemColorWithOtherPlatformAlternative({
                  ios: "systemYellow",
                  otherPlatforms: "#ffcc02",
                }),
              )
            },
          })
        })

        describe("when the attendance API request fails", () => {
          it("shows a Trouble Connecting to the Internet message", async () => {
            const player = playerFactory({})

            const { playerApiToken } = await mockLoggedInPlayer({
              playerId: player.id,
            })

            const game = gameFactory({
              played_at: gamePlayedAtValue({ minutesInFuture: 1 }),
              players: [player],
            })

            await mockApi({
              mockedRequests: [
                mockGetGame(game),
                mockCreateOrUpdatePlayerAttendance(
                  game,
                  playerApiToken,
                  "Maybe",
                  "Network Error",
                ),
              ],
              test: async () => {
                ERTL.renderRouter("src/app", {
                  initialUrl: `/games/${game.id}`,
                })

                await ERTL.waitFor(() => {
                  expect(ERTL.screen).not.toShowTestId("Loading Spinner")
                })

                ERTL.fireEvent.press(ERTL.screen.getByText("Maybe"))

                await ERTL.waitFor(() => {
                  expect(ERTL.screen).not.toShowTestId("Mini Loading Spinner")
                })

                await ERTL.waitFor(() => {
                  expect(ERTL.screen).toShowText(
                    "Trouble Connecting to the Internet",
                  )
                })
              },
            })
          })

          it("unselects the Maybe radio button", async () => {
            const player = playerFactory({})

            const { playerApiToken } = await mockLoggedInPlayer({
              playerId: player.id,
            })

            const game = gameFactory({
              played_at: gamePlayedAtValue({ minutesInFuture: 1 }),
              players: [player],
            })

            await mockApi({
              mockedRequests: [
                mockGetGame(game),
                mockCreateOrUpdatePlayerAttendance(
                  game,
                  playerApiToken,
                  "Maybe",
                  "Network Error",
                ),
              ],
              test: async () => {
                ERTL.renderRouter("src/app", {
                  initialUrl: `/games/${game.id}`,
                })

                await ERTL.waitFor(() => {
                  expect(ERTL.screen).not.toShowTestId("Loading Spinner")
                })

                ERTL.fireEvent.press(ERTL.screen.getByText("Maybe"))

                await ERTL.waitFor(() => {
                  expect(ERTL.screen).not.toShowTestId("Mini Loading Spinner")
                })

                expect(
                  ERTL.screen.getByTestId("Maybe Radio Button").props.style
                    .backgroundColor,
                ).toEqual(undefined)
              },
            })
          })
        })

        describe("when leaving and returning to the game details screen", () => {
          it("remembers the Maybe selection", async () => {
            const player = playerFactory({})

            const { playerApiToken } = await mockLoggedInPlayer({
              playerId: player.id,
            })

            const game = gameFactory({
              played_at: gamePlayedAtValue({ minutesInFuture: 1 }),
              players: [player],
            })

            await mockApi({
              mockedRequests: [
                mockGetGames([game]),
                mockCreateOrUpdatePlayerAttendance(
                  game,
                  playerApiToken,
                  "Maybe",
                ),
              ],
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

                await ERTL.waitFor(() => {
                  ERTL.fireEvent.press(ERTL.screen.getByTestId("Back Button"))
                })

                await ERTL.waitFor(() => {
                  ERTL.fireEvent.press(
                    ERTL.screen.getByTestId("Game List Item"),
                  )
                })

                expect(
                  ERTL.screen.getByTestId("Maybe Radio Button").props.style
                    .backgroundColor,
                ).toEqual(
                  iosSystemColorWithOtherPlatformAlternative({
                    ios: "systemYellow",
                    otherPlatforms: "#ffcc02",
                  }),
                )
              },
            })
          })
        })

        describe("when leaving the games details screen and entering another games details screen", () => {
          it("does not change the Maybe selection on the details screen of the other game", async () => {
            const player = playerFactory({})
            const { playerApiToken } = await mockLoggedInPlayer({
              playerId: player.id,
            })

            const games = [
              gameFactory({
                played_at: gamePlayedAtValue({ minutesInFuture: 30 }),
                players: [player],
              }),
              gameFactory({
                played_at: gamePlayedAtValue({ minutesInFuture: 60 }),
                players: [player],
              }),
            ]

            await mockApi({
              mockedRequests: [
                mockGetGames(games),
                mockCreateOrUpdatePlayerAttendance(
                  games[0],
                  playerApiToken,
                  "Maybe",
                ),
              ],
              test: async () => {
                ERTL.renderRouter("src/app", { initialUrl: "/games" })

                await ERTL.waitFor(() => {
                  expect(ERTL.screen).not.toShowTestId("Loading Spinner")
                })

                await ERTL.waitFor(() => {
                  ERTL.fireEvent.press(
                    ERTL.screen.getAllByTestId("Game List Item")[0],
                  )
                })

                await ERTL.waitFor(() => {
                  expect(ERTL.screen).toShowText("Maybe")
                })

                ERTL.fireEvent.press(ERTL.screen.getByText("Maybe"))

                await ERTL.waitFor(() => {
                  ERTL.fireEvent.press(ERTL.screen.getByTestId("Back Button"))
                })

                await ERTL.waitFor(() => {
                  ERTL.fireEvent.press(
                    ERTL.screen.getAllByTestId("Game List Item")[1],
                  )
                })

                expect(
                  ERTL.screen.getByTestId("Maybe Radio Button").props.style
                    .backgroundColor,
                ).not.toEqual(
                  iosSystemColorWithOtherPlatformAlternative({
                    ios: "systemYellow",
                    otherPlatforms: "#ffcc02",
                  }),
                )
              },
            })
          })
        })

        describe("when Maybe is tapped a second time in a row", () => {
          it("does not send a duplicate API request", async () => {
            const player = playerFactory({})

            const { playerApiToken } = await mockLoggedInPlayer({
              playerId: player.id,
            })

            const game = gameFactory({
              played_at: gamePlayedAtValue({ minutesInFuture: 1 }),
              players: [player],
            })

            await mockApi({
              mockedRequests: [
                mockGetGame(game),
                mockCreateOrUpdatePlayerAttendance(
                  game,
                  playerApiToken,
                  "Maybe",
                ),
              ],
              test: async () => {
                ERTL.renderRouter("src/app", {
                  initialUrl: `/games/${game.id}`,
                })

                await ERTL.waitFor(() => {
                  expect(ERTL.screen).not.toShowTestId("Loading Spinner")
                })

                ERTL.fireEvent.press(ERTL.screen.getByText("Maybe"))

                await ERTL.waitFor(() => {
                  expect(ERTL.screen).not.toShowTestId("Loading Spinner")
                })

                ERTL.fireEvent.press(ERTL.screen.getByText("Maybe"))

                await ERTL.waitFor(() => {
                  expect(ERTL.screen).not.toShowTestId("Loading Spinner")
                })
              },
            })
          })
        })

        describe("when Yes is tapped after tapping Maybe", () => {
          it("removes the ? icon by the players name in the attendance list", async () => {
            const player = playerFactory({})

            const { playerApiToken } = await mockLoggedInPlayer({
              playerId: player.id,
            })

            const game = gameFactory({
              played_at: gamePlayedAtValue({ minutesInFuture: 1 }),
              players: [player],
            })

            await mockApi({
              mockedRequests: [
                mockGetGame(game),
                mockCreateOrUpdatePlayerAttendance(
                  game,
                  playerApiToken,
                  "Maybe",
                ),
                mockCreateOrUpdatePlayerAttendance(game, playerApiToken, "Yes"),
              ],
              test: async () => {
                ERTL.renderRouter("src/app", {
                  initialUrl: `/games/${game.id}`,
                })

                await ERTL.waitFor(() => {
                  expect(ERTL.screen).not.toShowTestId("Loading Spinner")
                })

                ERTL.fireEvent.press(ERTL.screen.getByText("Maybe"))

                await ERTL.waitFor(() => {
                  expect(
                    ERTL.within(
                      ERTL.screen.getByTestId(
                        `Player ${player.id} Attendance List Item`,
                      ),
                    ),
                  ).toShowTestId("? Icon")
                })

                ERTL.fireEvent.press(ERTL.screen.getByText("Yes"))

                await ERTL.waitFor(() => {
                  expect(
                    ERTL.within(
                      ERTL.screen.getByTestId(
                        `Player ${player.id} Attendance List Item`,
                      ),
                    ),
                  ).not.toShowTestId("? Icon")
                })
              },
            })
          })

          describe("when the attendance API request fails", () => {
            it("shows a Trouble Connecting to the Internet message", async () => {
              const player = playerFactory({})

              const { playerApiToken } = await mockLoggedInPlayer({
                playerId: player.id,
              })

              const game = gameFactory({
                played_at: gamePlayedAtValue({ minutesInFuture: 1 }),
                players: [player],
              })

              await mockApi({
                mockedRequests: [
                  mockGetGame(game),
                  mockCreateOrUpdatePlayerAttendance(
                    game,
                    playerApiToken,
                    "Maybe",
                  ),
                  mockCreateOrUpdatePlayerAttendance(
                    game,
                    playerApiToken,
                    "Yes",
                    "Network Error",
                  ),
                ],
                test: async () => {
                  ERTL.renderRouter("src/app", {
                    initialUrl: `/games/${game.id}`,
                  })

                  await ERTL.waitFor(() => {
                    expect(ERTL.screen).not.toShowTestId("Loading Spinner")
                  })

                  ERTL.fireEvent.press(ERTL.screen.getByText("Maybe"))

                  await ERTL.waitFor(() => {
                    expect(ERTL.screen).not.toShowTestId("Mini Loading Spinner")
                  })

                  ERTL.fireEvent.press(ERTL.screen.getByText("Yes"))

                  await ERTL.waitFor(() => {
                    expect(ERTL.screen).not.toShowTestId("Mini Loading Spinner")
                  })

                  await ERTL.waitFor(() => {
                    expect(ERTL.screen).toShowText(
                      "Trouble Connecting to the Internet",
                    )
                  })
                },
              })
            })

            it("unselects the Yes radio button and reselects the Maybe radio button", async () => {
              const player = playerFactory({})

              const { playerApiToken } = await mockLoggedInPlayer({
                playerId: player.id,
              })

              const game = gameFactory({
                played_at: gamePlayedAtValue({ minutesInFuture: 1 }),
                players: [player],
              })

              await mockApi({
                mockedRequests: [
                  mockGetGame(game),
                  mockCreateOrUpdatePlayerAttendance(
                    game,
                    playerApiToken,
                    "Maybe",
                  ),
                  mockCreateOrUpdatePlayerAttendance(
                    game,
                    playerApiToken,
                    "Yes",
                    "Network Error",
                  ),
                ],
                test: async () => {
                  ERTL.renderRouter("src/app", {
                    initialUrl: `/games/${game.id}`,
                  })

                  await ERTL.waitFor(() => {
                    expect(ERTL.screen).not.toShowTestId("Loading Spinner")
                  })

                  ERTL.fireEvent.press(ERTL.screen.getByText("Maybe"))

                  await ERTL.waitFor(() => {
                    expect(ERTL.screen).not.toShowTestId("Mini Loading Spinner")
                  })

                  ERTL.fireEvent.press(ERTL.screen.getByText("Yes"))

                  await ERTL.waitFor(() => {
                    expect(ERTL.screen).not.toShowTestId("Mini Loading Spinner")
                  })

                  expect(
                    ERTL.screen.getByTestId("Yes Radio Button").props.style
                      .backgroundColor,
                  ).toEqual(undefined)

                  expect(
                    ERTL.screen.getByTestId("Maybe Radio Button").props.style
                      .backgroundColor,
                  ).toEqual(
                    iosSystemColorWithOtherPlatformAlternative({
                      ios: "systemYellow",
                      otherPlatforms: "#ffcc02",
                    }),
                  )
                },
              })
            })
          })
        })

        describe("when No is tapped after tapping Maybe", () => {
          it("removes the X icon by the players name in the attendance list", async () => {
            const player = playerFactory({})

            const { playerApiToken } = await mockLoggedInPlayer({
              playerId: player.id,
            })

            const game = gameFactory({
              played_at: gamePlayedAtValue({ minutesInFuture: 1 }),
              players: [player],
            })

            await mockApi({
              mockedRequests: [
                mockGetGame(game),
                mockCreateOrUpdatePlayerAttendance(
                  game,
                  playerApiToken,
                  "Maybe",
                ),
                mockCreateOrUpdatePlayerAttendance(game, playerApiToken, "No"),
              ],
              test: async () => {
                ERTL.renderRouter("src/app", {
                  initialUrl: `/games/${game.id}`,
                })

                await ERTL.waitFor(() => {
                  expect(ERTL.screen).not.toShowTestId("Loading Spinner")
                })

                ERTL.fireEvent.press(ERTL.screen.getByText("Maybe"))

                await ERTL.waitFor(() => {
                  expect(
                    ERTL.within(
                      ERTL.screen.getByTestId(
                        `Player ${player.id} Attendance List Item`,
                      ),
                    ),
                  ).toShowTestId("? Icon")
                })

                ERTL.fireEvent.press(ERTL.screen.getByText("No"))

                await ERTL.waitFor(() => {
                  expect(
                    ERTL.within(
                      ERTL.screen.getByTestId(
                        `Player ${player.id} Attendance List Item`,
                      ),
                    ),
                  ).not.toShowTestId("? Icon")
                })
              },
            })
          })

          describe("when the attendance API request fails", () => {
            it("shows a Trouble Connecting to the Internet message", async () => {
              const player = playerFactory({})

              const { playerApiToken } = await mockLoggedInPlayer({
                playerId: player.id,
              })

              const game = gameFactory({
                played_at: gamePlayedAtValue({ minutesInFuture: 1 }),
                players: [player],
              })

              await mockApi({
                mockedRequests: [
                  mockGetGame(game),
                  mockCreateOrUpdatePlayerAttendance(
                    game,
                    playerApiToken,
                    "Maybe",
                  ),
                  mockCreateOrUpdatePlayerAttendance(
                    game,
                    playerApiToken,
                    "No",
                    "Network Error",
                  ),
                ],
                test: async () => {
                  ERTL.renderRouter("src/app", {
                    initialUrl: `/games/${game.id}`,
                  })

                  await ERTL.waitFor(() => {
                    expect(ERTL.screen).not.toShowTestId("Loading Spinner")
                  })

                  ERTL.fireEvent.press(ERTL.screen.getByText("Maybe"))

                  await ERTL.waitFor(() => {
                    expect(ERTL.screen).not.toShowTestId("Mini Loading Spinner")
                  })

                  ERTL.fireEvent.press(ERTL.screen.getByText("No"))

                  await ERTL.waitFor(() => {
                    expect(ERTL.screen).not.toShowTestId("Mini Loading Spinner")
                  })

                  await ERTL.waitFor(() => {
                    expect(ERTL.screen).toShowText(
                      "Trouble Connecting to the Internet",
                    )
                  })
                },
              })
            })

            it("unselects the No radio button and reselects the Maybe radio button", async () => {
              const player = playerFactory({})

              const { playerApiToken } = await mockLoggedInPlayer({
                playerId: player.id,
              })

              const game = gameFactory({
                played_at: gamePlayedAtValue({ minutesInFuture: 1 }),
                players: [player],
              })

              await mockApi({
                mockedRequests: [
                  mockGetGame(game),
                  mockCreateOrUpdatePlayerAttendance(
                    game,
                    playerApiToken,
                    "Maybe",
                  ),
                  mockCreateOrUpdatePlayerAttendance(
                    game,
                    playerApiToken,
                    "No",
                    "Network Error",
                  ),
                ],
                test: async () => {
                  ERTL.renderRouter("src/app", {
                    initialUrl: `/games/${game.id}`,
                  })

                  await ERTL.waitFor(() => {
                    expect(ERTL.screen).not.toShowTestId("Loading Spinner")
                  })

                  ERTL.fireEvent.press(ERTL.screen.getByText("Maybe"))

                  await ERTL.waitFor(() => {
                    expect(ERTL.screen).not.toShowTestId("Mini Loading Spinner")
                  })

                  ERTL.fireEvent.press(ERTL.screen.getByText("No"))

                  await ERTL.waitFor(() => {
                    expect(ERTL.screen).not.toShowTestId("Mini Loading Spinner")
                  })

                  expect(
                    ERTL.screen.getByTestId("No Radio Button").props.style
                      .backgroundColor,
                  ).toEqual(undefined)

                  expect(
                    ERTL.screen.getByTestId("Maybe Radio Button").props.style
                      .backgroundColor,
                  ).toEqual(
                    iosSystemColorWithOtherPlatformAlternative({
                      ios: "systemYellow",
                      otherPlatforms: "#ffcc02",
                    }),
                  )
                },
              })
            })
          })
        })
      })
    })
  })
})
