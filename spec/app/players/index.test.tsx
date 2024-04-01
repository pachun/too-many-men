import * as ERTL from "expo-router/testing-library"
import * as ReactNative from "react-native"
import playerFactory from "../../specHelpers/factories/player"
import pullToRefresh from "../../specHelpers/pullToRefresh"
import mockApi, { mockGetPlayers } from "../../specHelpers/mockApi"

describe("opening the app", () => {
  it("sets the navigation bar title to Team", async () => {
    ERTL.renderRouter("src/app")

    await ERTL.waitFor(() => {
      expect(ERTL.screen).toHaveNavigationBarTitle("Team")
    })
  })

  describe("when players are loading", () => {
    it("shows a loading spinner", async () => {
      await mockApi({
        mockedRequests: [mockGetPlayers([])],
        test: async () => {
          ERTL.renderRouter("src/app")

          await ERTL.waitFor(() => {
            expect(ERTL.screen).toShowTestId("Loading Spinner")
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

      await mockApi({
        mockedRequests: [mockGetPlayers(players)],
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

      await mockApi({
        mockedRequests: [mockGetPlayers(improperlySortedPlayers)],
        test: async () => {
          ERTL.renderRouter("src/app")

          await ERTL.waitFor(() => {
            expect(ERTL.screen).not.toShowTestId("Loading Spinner")
          })

          const playerListItems = ERTL.screen.getAllByTestId("Player List Item")

          expect(ERTL.within(playerListItems[0])).toShowText("Jim Halpert")
          expect(ERTL.within(playerListItems[1])).toShowText("Dwight Schrute")
        },
      })
    })

    it("removes the loading spinner", async () => {
      await mockApi({
        mockedRequests: [mockGetPlayers([])],
        test: async () => {
          ERTL.renderRouter("src/app")

          await ERTL.waitFor(() => {
            expect(ERTL.screen).not.toShowTestId("Loading Spinner")
          })
        },
      })
    })

    describe("tapping a players name", () => {
      it("highlights the player list item while the player is tap is in progress", async () => {
        const players = [
          playerFactory({ first_name: "Dwight", last_name: "Schrute" }),
        ]

        await mockApi({
          mockedRequests: [mockGetPlayers(players)],
          test: async () => {
            ERTL.renderRouter("src/app")

            await ERTL.waitFor(() => {
              expect(ERTL.screen).not.toShowTestId("Loading Spinner")
            })

            const playerListItems =
              ERTL.screen.getAllByTestId("Player List Item")

            ERTL.fireEvent(playerListItems[0], "pressIn")

            if (ReactNative.Platform.OS === "ios") {
              await ERTL.waitFor(() => {
                expect(playerListItems[0].props.style.backgroundColor).toEqual({
                  semantic: ["tertiarySystemBackground"],
                })
              })
            } else {
              await ERTL.waitFor(() => {
                expect(playerListItems[0].props.style.backgroundColor).toEqual(
                  "white",
                )
              })
            }

            ERTL.fireEvent(playerListItems[0], "pressOut")

            if (ReactNative.Platform.OS === "ios") {
              await ERTL.waitFor(() => {
                expect(
                  playerListItems[0].props.style.backgroundColor,
                ).not.toEqual({
                  semantic: ["tertiarySystemBackground"],
                })
              })
            } else {
              await ERTL.waitFor(() => {
                expect(
                  playerListItems[0].props.style.backgroundColor,
                ).not.toEqual("white")
              })
            }
          },
        })
      })

      it("shows the player's details screen (without refetching the players details from the api)", async () => {
        const player = playerFactory({
          id: 1,
          first_name: "Creed",
          last_name: "Bratton",
          jersey_number: 55,
          phone_number: "0123456789",
        })

        await mockApi({
          mockedRequests: [mockGetPlayers([player])],
          test: async () => {
            ERTL.renderRouter("src/app")

            await ERTL.waitFor(() => {
              expect(ERTL.screen).toShowText("Creed Bratton")
            })

            ERTL.fireEvent.press(ERTL.screen.getByText("Creed Bratton"))

            await ERTL.waitFor(() => {
              expect(ERTL.screen).toHavePathname("/players/1")
              expect(ERTL.screen).toHaveNavigationBarTitle("Creed Bratton")
              expect(ERTL.screen).toShowText("#55")
              expect(ERTL.screen).toShowText("(012) 345-6789")
            })
          },
        })
      })
    })
  })

  describe("when there is a network problem loading players", () => {
    it("removes the loading spinner", async () => {
      await mockApi({
        mockedRequests: [mockGetPlayers([], "Network Error")],
        test: async () => {
          ERTL.renderRouter("src/app")

          await ERTL.waitFor(() => {
            expect(ERTL.screen).not.toShowTestId("Loading Spinner")
          })
        },
      })
    })

    it("shows an error message", async () => {
      await mockApi({
        mockedRequests: [mockGetPlayers([], "Network Error")],
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
        await mockApi({
          mockedRequests: [mockGetPlayers([], "Network Error")],
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
      await mockApi({
        mockedRequests: [mockGetPlayers([], "Network Error")],
        test: async () => {
          ERTL.renderRouter("src/app")

          await ERTL.waitFor(() =>
            expect(ERTL.screen).toShowTestId("Reload Button"),
          )
        },
      })
    })

    describe("when the reload button is tapped", () => {
      it("removes the error message", async () => {
        await mockApi({
          mockedRequests: [mockGetPlayers([], "Network Error")],
          test: async () => {
            ERTL.renderRouter("src/app")

            await ERTL.waitFor(() =>
              expect(ERTL.screen).toShowTestId("Reload Button"),
            )
          },
        })

        await mockApi({
          mockedRequests: [mockGetPlayers([], "Network Error")],
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
        await mockApi({
          mockedRequests: [mockGetPlayers([], "Network Error")],
          test: async () => {
            ERTL.renderRouter("src/app")

            await ERTL.waitFor(() =>
              expect(ERTL.screen).toShowTestId("Reload Button"),
            )
          },
        })

        await mockApi({
          mockedRequests: [mockGetPlayers([], "Network Error")],
          test: async () => {
            ERTL.fireEvent.press(ERTL.screen.getByTestId("Reload Button"))

            await ERTL.waitFor(() =>
              expect(ERTL.screen).not.toShowTestId("Reload Button"),
            )
          },
        })
      })

      it("shows a loading spinner", async () => {
        await mockApi({
          mockedRequests: [mockGetPlayers([], "Network Error")],
          test: async () => {
            ERTL.renderRouter("src/app")

            await ERTL.waitFor(() =>
              expect(ERTL.screen).toShowTestId("Reload Button"),
            )
          },
        })

        await mockApi({
          mockedRequests: [mockGetPlayers([], "Network Error")],
          test: async () => {
            ERTL.fireEvent.press(ERTL.screen.getByTestId("Reload Button"))

            await ERTL.waitFor(() =>
              expect(ERTL.screen).toShowTestId("Loading Spinner"),
            )
          },
        })
      })

      describe("when the reload finishes", () => {
        it("shows players", async () => {
          await mockApi({
            mockedRequests: [mockGetPlayers([], "Network Error")],
            test: async () => {
              ERTL.renderRouter("src/app")

              await ERTL.waitFor(() =>
                expect(ERTL.screen).toShowTestId("Reload Button"),
              )
            },
          })

          await mockApi({
            mockedRequests: [
              mockGetPlayers([
                playerFactory({ first_name: "Kelly", last_name: "Kapoor" }),
              ]),
            ],
            test: async () => {
              ERTL.fireEvent.press(ERTL.screen.getByTestId("Reload Button"))

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

      await mockApi({
        mockedRequests: [mockGetPlayers(originalPlayers)],
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

      await mockApi({
        mockedRequests: [mockGetPlayers(refreshedPlayers)],
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

        await mockApi({
          mockedRequests: [mockGetPlayers(originalPlayers)],
          test: async () => {
            ERTL.renderRouter("src/app")

            await ERTL.waitFor(() => {
              expect(ERTL.screen).toShowText("Jim Halpert")
              expect(ERTL.screen).toShowText("Dwight Schrute")
            })
          },
        })

        await mockApi({
          mockedRequests: [mockGetPlayers([], "Network Error")],
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

        await mockApi({
          mockedRequests: [mockGetPlayers(originalPlayers)],
          test: async () => {
            ERTL.renderRouter("src/app")

            await ERTL.waitFor(() => {
              expect(ERTL.screen).toShowText("Jim Halpert")
              expect(ERTL.screen).toShowText("Dwight Schrute")
            })
          },
        })

        await mockApi({
          mockedRequests: [mockGetPlayers([], "Network Error")],
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
