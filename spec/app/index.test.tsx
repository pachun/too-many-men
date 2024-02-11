import * as ERTL from "expo-router/testing-library"
import playerFactory from "../specHelpers/factories/player"
import mockPlayersFromApi from "../specHelpers/mockPlayersFromApi"
import pullToRefresh from "../specHelpers/pullToRefresh"

describe("opening the app", () => {
  it("sets the navigation bar title to Team", async () => {
    ERTL.renderRouter("src/app")

    await ERTL.waitFor(() => {
      expect(ERTL.screen).toShowText("Team")
    })
  })

  describe("when players are loading", () => {
    it("shows a loading spinner", async () => {
      await mockPlayersFromApi({
        response: [],
        test: async () => {
          ERTL.renderRouter("src/app")

          await ERTL.waitFor(() => {
            expect(ERTL.screen).toShowTestID("Loading Spinner")
          })
        },
      })
    })
  })

  describe("when players have loaded", () => {
    it("shows players full names", async () => {
      const players = [
        playerFactory({ first_name: "Jim", last_name: "Halpert" }),
        playerFactory({ first_name: "Dwight", last_name: "Schrute" }),
      ]

      await mockPlayersFromApi({
        response: players,
        test: async () => {
          ERTL.renderRouter("src/app")

          await ERTL.waitFor(() => {
            expect(ERTL.screen).toShowText("Jim Halpert")
            expect(ERTL.screen).toShowText("Dwight Schrute")
          })
        },
      })
    })

    it("orders players alphabetically by last name", async () => {
      const improperlySortedPlayers = [
        playerFactory({ first_name: "Dwight", last_name: "Schrute" }),
        playerFactory({ first_name: "Jim", last_name: "Halpert" }),
      ]

      await mockPlayersFromApi({
        response: improperlySortedPlayers,
        test: async () => {
          ERTL.renderRouter("src/app")

          await ERTL.waitFor(() => {
            expect(ERTL.screen).not.toShowTestID("Loading Spinner")
          })

          const playerListItems = ERTL.screen.getAllByTestId("Player List Item")

          expect(ERTL.within(playerListItems[0])).toShowText("Jim Halpert")
          expect(ERTL.within(playerListItems[1])).toShowText("Dwight Schrute")
        },
      })
    })

    it("shows players jersey numbers", async () => {
      const players = [
        playerFactory({ jersey_number: 1 }),
        playerFactory({ jersey_number: 2 }),
      ]

      await mockPlayersFromApi({
        response: players,
        test: async () => {
          ERTL.renderRouter("src/app")

          await ERTL.waitFor(() => {
            expect(ERTL.screen).toShowText("#1")
            expect(ERTL.screen).toShowText("#2")
          })
        },
      })
    })

    it("shows players phone numbers", async () => {
      const players = [
        playerFactory({ phone_number: "0123456789" }),
        playerFactory({ phone_number: "9876543210" }),
      ]

      await mockPlayersFromApi({
        response: players,
        test: async () => {
          ERTL.renderRouter("src/app")

          await ERTL.waitFor(() => {
            expect(ERTL.screen).toShowText("(012) 345 6789")
            expect(ERTL.screen).toShowText("(987) 654 3210")
          })
        },
      })
    })

    describe("when a player does not have a jersey number", () => {
      it("does not show a jersey number for the player", async () => {
        const player = playerFactory({
          first_name: "Creed",
          last_name: "Bratton",
        })

        await mockPlayersFromApi({
          response: [player],
          test: async () => {
            ERTL.renderRouter("src/app")

            await ERTL.waitFor(() => {
              expect(ERTL.screen).toShowText("Creed Bratton")
              expect(ERTL.screen).not.toShowText("#")
            })
          },
        })
      })
    })

    it("removes the loading spinner", async () => {
      await mockPlayersFromApi({
        response: [],
        test: async () => {
          ERTL.renderRouter("src/app")

          await ERTL.waitFor(() => {
            expect(ERTL.screen).not.toShowTestID("Loading Spinner")
          })
        },
      })
    })
  })

  describe("when there is a network problem loading players", () => {
    it("removes the loading spinner", async () => {
      await mockPlayersFromApi({
        response: "Network Error",
        test: async () => {
          ERTL.renderRouter("src/app")

          await ERTL.waitFor(() => {
            expect(ERTL.screen).not.toShowTestID("Loading Spinner")
          })
        },
      })
    })

    it("shows an error message", async () => {
      await mockPlayersFromApi({
        response: "Network Error",
        test: async () => {
          ERTL.renderRouter("src/app")

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
        await mockPlayersFromApi({
          response: "Network Error",
          test: async () => {
            ERTL.renderRouter("src/app")

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
      await mockPlayersFromApi({
        response: "Network Error",
        test: async () => {
          ERTL.renderRouter("src/app")

          await ERTL.waitFor(() => expect(ERTL.screen).toShowText("Reload"))
        },
      })
    })

    describe("when the reload button is tapped", () => {
      it("removes the error message", async () => {
        await mockPlayersFromApi({
          response: "Network Error",
          test: async () => {
            ERTL.renderRouter("src/app")

            await ERTL.waitFor(() => expect(ERTL.screen).toShowText("Reload"))
          },
        })

        await mockPlayersFromApi({
          response: "Network Error",
          test: async () => {
            ERTL.fireEvent.press(ERTL.screen.getByText("Reload"))

            await ERTL.waitFor(() =>
              expect(ERTL.screen).not.toShowText(
                "Trouble Connecting to the Internet",
              ),
            )
          },
        })
      })

      it("removes the reload button", async () => {
        await mockPlayersFromApi({
          response: "Network Error",
          test: async () => {
            ERTL.renderRouter("src/app")

            await ERTL.waitFor(() => expect(ERTL.screen).toShowText("Reload"))
          },
        })

        await mockPlayersFromApi({
          response: "Network Error",
          test: async () => {
            ERTL.fireEvent.press(ERTL.screen.getByText("Reload"))

            await ERTL.waitFor(() =>
              expect(ERTL.screen).not.toShowText("Reload"),
            )
          },
        })
      })

      it("shows a loading spinner", async () => {
        await mockPlayersFromApi({
          response: "Network Error",
          test: async () => {
            ERTL.renderRouter("src/app")

            await ERTL.waitFor(() => expect(ERTL.screen).toShowText("Reload"))
          },
        })

        await mockPlayersFromApi({
          response: "Network Error",
          test: async () => {
            ERTL.fireEvent.press(ERTL.screen.getByText("Reload"))

            await ERTL.waitFor(() =>
              expect(ERTL.screen).toShowTestID("Loading Spinner"),
            )
          },
        })
      })

      describe("when the reload finishes", () => {
        it("shows players", async () => {
          await mockPlayersFromApi({
            response: "Network Error",
            test: async () => {
              ERTL.renderRouter("src/app")

              await ERTL.waitFor(() => expect(ERTL.screen).toShowText("Reload"))
            },
          })

          await mockPlayersFromApi({
            response: [
              playerFactory({ first_name: "Kelly", last_name: "Kapoor" }),
            ],
            test: async () => {
              ERTL.fireEvent.press(ERTL.screen.getByText("Reload"))

              await ERTL.waitFor(() =>
                expect(ERTL.screen).toShowText("Kelly Kapoor"),
              )
            },
          })
        })
      })
    })
  })

  describe("when the player list is pulled down", () => {
    it("shows refreshed players", async () => {
      const originalPlayers = [
        playerFactory({ first_name: "Jim", last_name: "Halpert" }),
        playerFactory({ first_name: "Dwight", last_name: "Schrute" }),
      ]

      await mockPlayersFromApi({
        response: originalPlayers,
        test: async () => {
          ERTL.renderRouter("src/app")

          await ERTL.waitFor(() => {
            expect(ERTL.screen).toShowText("Jim Halpert")
            expect(ERTL.screen).toShowText("Dwight Schrute")
          })
        },
      })

      const refreshedPlayers = [
        playerFactory({ first_name: "Michael", last_name: "Scott" }),
        playerFactory({ first_name: "Stanley", last_name: "Hudson" }),
      ]

      await mockPlayersFromApi({
        response: refreshedPlayers,
        test: async () => {
          await pullToRefresh("Player List")

          await ERTL.waitFor(() => {
            expect(ERTL.screen).toShowText("Michael Scott")
            expect(ERTL.screen).toShowText("Stanley Hudson")
          })
        },
      })
    })

    describe("when there is a network problem refreshing players", () => {
      it("shows an error message", async () => {
        const originalPlayers = [
          playerFactory({ first_name: "Jim", last_name: "Halpert" }),
          playerFactory({ first_name: "Dwight", last_name: "Schrute" }),
        ]

        await mockPlayersFromApi({
          response: originalPlayers,
          test: async () => {
            ERTL.renderRouter("src/app")

            await ERTL.waitFor(() => {
              expect(ERTL.screen).toShowText("Jim Halpert")
              expect(ERTL.screen).toShowText("Dwight Schrute")
            })
          },
        })

        await mockPlayersFromApi({
          response: "Network Error",
          test: async () => {
            await pullToRefresh("Player List")

            await ERTL.waitFor(() => {
              expect(ERTL.screen).toShowText(
                "Trouble Connecting to the Internet",
              )
            })
          },
        })
      })

      it("keeps showing the players that were successfully fetched before the failed refresh", async () => {
        const originalPlayers = [
          playerFactory({ first_name: "Jim", last_name: "Halpert" }),
          playerFactory({ first_name: "Dwight", last_name: "Schrute" }),
        ]

        await mockPlayersFromApi({
          response: originalPlayers,
          test: async () => {
            ERTL.renderRouter("src/app")

            await ERTL.waitFor(() => {
              expect(ERTL.screen).toShowText("Jim Halpert")
              expect(ERTL.screen).toShowText("Dwight Schrute")
            })
          },
        })

        await mockPlayersFromApi({
          response: "Network Error",
          test: async () => {
            await pullToRefresh("Player List")

            await ERTL.waitFor(() => {
              expect(ERTL.screen).toShowText("Jim Halpert")
              expect(ERTL.screen).toShowText("Dwight Schrute")
            })
          },
        })
      })
    })
  })
})
