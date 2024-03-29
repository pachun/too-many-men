import * as ERTL from "expo-router/testing-library"
import * as ReactNative from "react-native"
import * as DateFNS from "date-fns"
import type { Game } from "types/Game"
import gameFactory from "../specHelpers/factories/game"
import mockGamesFromApi from "../specHelpers/mockGamesFromApi"
import pullToRefresh from "../specHelpers/pullToRefresh"

const gameDate = (game: Game): string =>
  DateFNS.format(DateFNS.parseISO(game.played_at), "MMM d")

const gameTime = (game: Game): string =>
  DateFNS.format(DateFNS.parseISO(game.played_at), "h:mm a")

describe("viewing the games tab", () => {
  it("sets the navigation bar title to Games", async () => {
    ERTL.renderRouter("src/app", { initialUrl: "/games" })

    await ERTL.waitFor(() => {
      expect(ERTL.screen).toShowText("Games")
    })
  })

  describe("when games are loading", () => {
    it("shows a loading spinner", async () => {
      await mockGamesFromApi({
        response: [],
        test: async () => {
          ERTL.renderRouter("src/app", { initialUrl: "/games" })

          await ERTL.waitFor(() => {
            expect(ERTL.screen).toShowTestId("Loading Spinner")
          })
        },
      })
    })
  })

  describe("when games have loaded", () => {
    it("shows the games dates and times", async () => {
      const games = [
        gameFactory({ played_at: "2024-02-09T02:30:00Z" }),
        gameFactory({ played_at: "2024-02-16T03:15:00Z" }),
      ]

      await mockGamesFromApi({
        response: games,
        test: async () => {
          ERTL.renderRouter("src/app", { initialUrl: "/games" })

          await ERTL.waitFor(() => {
            expect(ERTL.screen).toShowText(gameDate(games[0]))
            expect(ERTL.screen).toShowText(gameTime(games[0]))
            expect(ERTL.screen).toShowText(gameDate(games[1]))
            expect(ERTL.screen).toShowText(gameTime(games[1]))
          })
        },
      })
    })

    it("shows whether the game is a home game or an away game", async () => {
      const games = [
        gameFactory({ played_at: "2024-02-09T02:30:00Z", is_home_team: true }),
        gameFactory({ played_at: "2024-02-16T03:15:00Z", is_home_team: false }),
      ]

      await mockGamesFromApi({
        response: games,
        test: async () => {
          ERTL.renderRouter("src/app", { initialUrl: "/games" })

          await ERTL.waitFor(() => {
            expect(ERTL.screen).not.toShowTestId("Loading Spinner")
          })

          const gameListItems = ERTL.screen.getAllByTestId("Game List Item")

          await ERTL.waitFor(() => {
            expect(ERTL.within(gameListItems[0])).toShowText("Home")
            expect(ERTL.within(gameListItems[1])).toShowText("Away")
          })
        },
      })
    })

    it("shows the rink that the game is played on", async () => {
      const games = [
        gameFactory({ played_at: "2024-02-09T02:30:00Z", rink: "Rink A" }),
        gameFactory({ played_at: "2024-02-16T03:15:00Z", rink: "Rink B" }),
      ]

      await mockGamesFromApi({
        response: games,
        test: async () => {
          ERTL.renderRouter("src/app", { initialUrl: "/games" })

          await ERTL.waitFor(() => {
            expect(ERTL.screen).not.toShowTestId("Loading Spinner")
          })

          const gameListItems = ERTL.screen.getAllByTestId("Game List Item")

          await ERTL.waitFor(() => {
            expect(ERTL.within(gameListItems[0])).toShowText("Rink A")
            expect(ERTL.within(gameListItems[1])).toShowText("Rink B")
          })
        },
      })
    })

    describe("when the game has an opposing team name populated", () => {
      it("shows the opposing teams name", async () => {
        const games = [
          gameFactory({
            played_at: "2024-02-09T02:30:00Z",
            opposing_teams_name: "Scott's Tots",
          }),
          gameFactory({
            played_at: "2024-02-16T03:15:00Z",
            opposing_teams_name: "The Einsteins",
          }),
        ]

        await mockGamesFromApi({
          response: games,
          test: async () => {
            ERTL.renderRouter("src/app", { initialUrl: "/games" })

            await ERTL.waitFor(() => {
              expect(ERTL.screen).not.toShowTestId("Loading Spinner")
            })

            const gameListItems = ERTL.screen.getAllByTestId("Game List Item")

            await ERTL.waitFor(() => {
              expect(ERTL.within(gameListItems[0])).toShowText("v Scott's Tots")
              expect(ERTL.within(gameListItems[1])).toShowText(
                "v The Einsteins",
              )
            })
          },
        })
      })
    })

    describe("when the game has a score populated", () => {
      it("shows the games scores in (green, red, and gray) for (wins, losses and ties), respectively", async () => {
        const games = [
          gameFactory({
            played_at: "2024-02-09T02:30:00Z",
            goals_for: 2,
            goals_against: 1,
          }),
          gameFactory({
            played_at: "2024-02-16T03:15:00Z",
            goals_for: 0,
            goals_against: 3,
          }),
          gameFactory({
            played_at: "2024-02-18T03:15:00Z",
            goals_for: 0,
            goals_against: 0,
          }),
        ]

        await mockGamesFromApi({
          response: games,
          test: async () => {
            ERTL.renderRouter("src/app", { initialUrl: "/games" })

            await ERTL.waitFor(() => {
              expect(ERTL.screen).not.toShowTestId("Loading Spinner")
            })

            const gameListItems = ERTL.screen.getAllByTestId("Game List Item")

            await ERTL.waitFor(() => {
              expect(ERTL.within(gameListItems[0])).toShowText("2 - 1 W")
              expect(ERTL.within(gameListItems[1])).toShowText("0 - 3 L")
              expect(ERTL.within(gameListItems[2])).toShowText("0 - 0 T")

              const winLabelColor = ERTL.within(gameListItems[0]).getByText(
                "2 - 1 W",
              ).props.style.color
              const lossLabelColor = ERTL.within(gameListItems[1]).getByText(
                "0 - 3 L",
              ).props.style.color
              const tieLabelColor = ERTL.within(gameListItems[2]).getByText(
                "0 - 0 T",
              ).props.style.color

              if (ReactNative.Platform.OS === "ios") {
                expect(winLabelColor).toEqual({ semantic: ["systemGreen"] })
                expect(lossLabelColor).toEqual({ semantic: ["systemRed"] })
                expect(tieLabelColor).toEqual({ semantic: ["systemGray"] })
              } else {
                expect(winLabelColor).toEqual("green")
                expect(lossLabelColor).toEqual("red")
                expect(tieLabelColor).toEqual("gray")
              }
            })
          },
        })
      })
    })

    describe("when the game does not have an opposing team name populated", () => {
      it("does not show an opposing team name label", async () => {
        const games = [
          gameFactory({
            opposing_teams_name: undefined,
          }),
        ]

        await mockGamesFromApi({
          response: games,
          test: async () => {
            ERTL.renderRouter("src/app", { initialUrl: "/games" })

            await ERTL.waitFor(() => {
              expect(ERTL.screen).not.toShowTestId("Loading Spinner")
            })

            await ERTL.waitFor(() => {
              expect(ERTL.screen).not.toShowText(`v undefined`)
            })
          },
        })
      })
    })

    it("orders games chronologically", async () => {
      const earlierGame = gameFactory({ played_at: "2024-02-09T02:30:00Z" })
      const laterGame = gameFactory({ played_at: "2024-02-16T03:15:00Z" })
      const nonChronologicallyOrderedGames = [laterGame, earlierGame]

      await mockGamesFromApi({
        response: nonChronologicallyOrderedGames,
        test: async () => {
          ERTL.renderRouter("src/app", { initialUrl: "/games" })

          await ERTL.waitFor(() => {
            expect(ERTL.screen).not.toShowTestId("Loading Spinner")
          })

          const gameListItems = ERTL.screen.getAllByTestId("Game List Item")

          expect(ERTL.within(gameListItems[0])).toShowText(
            gameDate(earlierGame),
          )
          expect(ERTL.within(gameListItems[0])).toShowText(
            gameTime(earlierGame),
          )
          expect(ERTL.within(gameListItems[1])).toShowText(gameDate(laterGame))
          expect(ERTL.within(gameListItems[1])).toShowText(gameTime(laterGame))
        },
      })
    })

    it("removes the loading spinner", async () => {
      await mockGamesFromApi({
        response: [],
        test: async () => {
          ERTL.renderRouter("src/app", { initialUrl: "/games" })

          await ERTL.waitFor(() => {
            expect(ERTL.screen).not.toShowTestId("Loading Spinner")
          })
        },
      })
    })
  })

  describe("when there is a network problem loading games", () => {
    it("removes the loading spinner", async () => {
      await mockGamesFromApi({
        response: "Network Error",
        test: async () => {
          ERTL.renderRouter("src/app", { initialUrl: "/games" })

          await ERTL.waitFor(() => {
            expect(ERTL.screen).not.toShowTestId("Loading Spinner")
          })
        },
      })
    })

    it("shows an error message", async () => {
      await mockGamesFromApi({
        response: "Network Error",
        test: async () => {
          ERTL.renderRouter("src/app", { initialUrl: "/games" })

          await ERTL.waitFor(() =>
            expect(ERTL.screen).toShowText(
              "Trouble Connecting to the Internet",
            ),
          )
        },
      })
    })

    describe("when the error message is tapped", () => {
      it("removes the error message", async () => {
        await mockGamesFromApi({
          response: "Network Error",
          test: async () => {
            ERTL.renderRouter("src/app", { initialUrl: "/games" })

            await ERTL.waitFor(() =>
              expect(ERTL.screen).toShowText(
                "Trouble Connecting to the Internet",
              ),
            )

            ERTL.fireEvent.press(
              ERTL.screen.getByText("Trouble Connecting to the Internet"),
            )

            await ERTL.waitFor(() =>
              expect(ERTL.screen).not.toShowText(
                "Trouble Connecting to the Internet",
              ),
            )
          },
        })
      })
    })

    it("shows a reload button", async () => {
      await mockGamesFromApi({
        response: "Network Error",
        test: async () => {
          ERTL.renderRouter("src/app", { initialUrl: "/games" })

          await ERTL.waitFor(() =>
            expect(ERTL.screen).toShowTestId("Reload Button"),
          )
        },
      })
    })

    describe("when the reload button is tapped", () => {
      it("removes the error message", async () => {
        await mockGamesFromApi({
          response: "Network Error",
          test: async () => {
            ERTL.renderRouter("src/app", { initialUrl: "/games" })

            await ERTL.waitFor(() =>
              expect(ERTL.screen).toShowTestId("Reload Button"),
            )
          },
        })

        await mockGamesFromApi({
          response: "Network Error",
          test: async () => {
            ERTL.fireEvent.press(ERTL.screen.getByTestId("Reload Button"))

            await ERTL.waitFor(() =>
              expect(ERTL.screen).not.toShowText(
                "Trouble Connecting to the Internet",
              ),
            )
          },
        })
      })

      it("removes the reload button", async () => {
        await mockGamesFromApi({
          response: "Network Error",
          test: async () => {
            ERTL.renderRouter("src/app", { initialUrl: "/games" })

            await ERTL.waitFor(() =>
              expect(ERTL.screen).toShowTestId("Reload Button"),
            )
          },
        })

        await mockGamesFromApi({
          response: "Network Error",
          test: async () => {
            ERTL.fireEvent.press(ERTL.screen.getByTestId("Reload Button"))

            await ERTL.waitFor(() =>
              expect(ERTL.screen).not.toShowTestId("Reload Button"),
            )
          },
        })
      })

      it("shows a loading spinner", async () => {
        await mockGamesFromApi({
          response: "Network Error",
          test: async () => {
            ERTL.renderRouter("src/app", { initialUrl: "/games" })

            await ERTL.waitFor(() =>
              expect(ERTL.screen).toShowTestId("Reload Button"),
            )
          },
        })

        await mockGamesFromApi({
          response: "Network Error",
          test: async () => {
            ERTL.fireEvent.press(ERTL.screen.getByTestId("Reload Button"))

            await ERTL.waitFor(() =>
              expect(ERTL.screen).toShowTestId("Loading Spinner"),
            )
          },
        })
      })

      describe("when the reload finishes", () => {
        it("shows games", async () => {
          await mockGamesFromApi({
            response: "Network Error",
            test: async () => {
              ERTL.renderRouter("src/app", { initialUrl: "/games" })

              await ERTL.waitFor(() =>
                expect(ERTL.screen).toShowTestId("Reload Button"),
              )
            },
          })

          const game = gameFactory({ played_at: "2024-02-09T02:30:00Z" })

          await mockGamesFromApi({
            response: [game],
            test: async () => {
              ERTL.fireEvent.press(ERTL.screen.getByTestId("Reload Button"))

              await ERTL.waitFor(() => {
                expect(ERTL.screen).toShowText(gameDate(game))
                expect(ERTL.screen).toShowText(gameTime(game))
              })
            },
          })
        })
      })
    })
  })

  describe("when the game list is pulled down", () => {
    it("shows refreshed games", async () => {
      const originalGames = [
        gameFactory({ played_at: "2024-02-09T02:30:00Z" }),
        gameFactory({ played_at: "2024-02-16T03:15:00Z" }),
      ]

      await mockGamesFromApi({
        response: originalGames,
        test: async () => {
          ERTL.renderRouter("src/app", { initialUrl: "/games" })

          await ERTL.waitFor(() => {
            expect(ERTL.screen).toShowText(gameDate(originalGames[0]))
            expect(ERTL.screen).toShowText(gameTime(originalGames[0]))
            expect(ERTL.screen).toShowText(gameDate(originalGames[1]))
            expect(ERTL.screen).toShowText(gameTime(originalGames[1]))
          })
        },
      })

      const refreshedGames = [
        gameFactory({ played_at: "2024-01-26T03:15:00Z" }),
        gameFactory({ played_at: "2024-02-02T03:30:00Z" }),
      ]

      await mockGamesFromApi({
        response: refreshedGames,
        test: async () => {
          await pullToRefresh("Game List")

          await ERTL.waitFor(() => {
            expect(ERTL.screen).toShowText(gameDate(refreshedGames[0]))
            expect(ERTL.screen).toShowText(gameTime(refreshedGames[0]))
            expect(ERTL.screen).toShowText(gameDate(refreshedGames[1]))
            expect(ERTL.screen).toShowText(gameTime(refreshedGames[1]))
          })
        },
      })
    })

    describe("when there is a network problem refreshing games", () => {
      it("shows an error message", async () => {
        const games = [
          gameFactory({ played_at: "2024-02-09T02:30:00Z" }),
          gameFactory({ played_at: "2024-02-16T03:15:00Z" }),
        ]

        await mockGamesFromApi({
          response: games,
          test: async () => {
            ERTL.renderRouter("src/app", { initialUrl: "/games" })

            await ERTL.waitFor(() => {
              expect(ERTL.screen).toShowText(gameDate(games[0]))
              expect(ERTL.screen).toShowText(gameTime(games[0]))
              expect(ERTL.screen).toShowText(gameDate(games[1]))
              expect(ERTL.screen).toShowText(gameTime(games[1]))
            })
          },
        })

        await mockGamesFromApi({
          response: "Network Error",
          test: async () => {
            await pullToRefresh("Game List")

            await ERTL.waitFor(() => {
              expect(ERTL.screen).toShowText(
                "Trouble Connecting to the Internet",
              )
            })
          },
        })
      })

      it("keeps showing the games that were successfully fetched before the failed refresh", async () => {
        const games = [
          gameFactory({ played_at: "2024-02-09T02:30:00Z" }),
          gameFactory({ played_at: "2024-02-16T03:15:00Z" }),
        ]

        await mockGamesFromApi({
          response: games,
          test: async () => {
            ERTL.renderRouter("src/app", { initialUrl: "/games" })

            await ERTL.waitFor(() => {
              expect(ERTL.screen).toShowText(gameDate(games[0]))
              expect(ERTL.screen).toShowText(gameTime(games[0]))
              expect(ERTL.screen).toShowText(gameDate(games[1]))
              expect(ERTL.screen).toShowText(gameTime(games[1]))
            })
          },
        })

        await mockGamesFromApi({
          response: "Network Error",
          test: async () => {
            await pullToRefresh("Game List")

            await ERTL.waitFor(() => {
              expect(ERTL.screen).toShowText(gameDate(games[0]))
              expect(ERTL.screen).toShowText(gameTime(games[0]))
              expect(ERTL.screen).toShowText(gameDate(games[1]))
              expect(ERTL.screen).toShowText(gameTime(games[1]))
            })
          },
        })
      })
    })
  })
})
