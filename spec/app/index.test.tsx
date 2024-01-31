import * as ERTL from "expo-router/testing-library"
import * as MSW_NODE from "msw/node"
import playerFactory from "../specHelpers/factories/player"
import apiMock from "../specHelpers/apiMock"

describe("Opening the app", () => {
  it("sets the navigation bar title to Teammates", async () => {
    ERTL.renderRouter("src/app")

    await ERTL.waitFor(() => {
      expect(
        // @ts-ignore - We can't get RNTL to find this any other way
        // https://callstack.github.io/react-native-testing-library/docs/api-queries/#legacy-unit-testing-helpers
        ERTL.screen.UNSAFE_getByType("RNSScreenStackHeaderConfig").props.title,
      ).toEqual("Teammates")
    })
  })

  describe("when players are loading", () => {
    it("shows a loading spinner", async () => {
      const server = MSW_NODE.setupServer()
      await apiMock({
        server,
        mockedRequest: {
          method: "get",
          route: "/players",
          response: [],
        },
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
    it("shows players", async () => {
      await apiMock({
        mockedRequest: {
          method: "get",
          route: "/players",
          response: [
            playerFactory({ name: "Jim Halpert" }),
            playerFactory({ name: "Dwight Schrute" }),
          ],
        },
        test: async () => {
          ERTL.renderRouter("src/app")

          await ERTL.waitFor(() => {
            expect(ERTL.screen).toShowText("Jim Halpert")
            expect(ERTL.screen).toShowText("Dwight Schrute")
          })
        },
      })
    })

    it("removes the loading spinner", async () => {
      await apiMock({
        mockedRequest: {
          method: "get",
          route: "/players",
          response: [
            playerFactory({ name: "Jim Halpert" }),
            playerFactory({ name: "Dwight Schrute" }),
          ],
        },
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
      await apiMock({
        mockedRequest: {
          method: "get",
          route: "/players",
          response: "Network Error",
        },
        test: async () => {
          ERTL.renderRouter("src/app")

          await ERTL.waitFor(() => {
            expect(ERTL.screen).not.toShowTestID("Loading Spinner")
          })
        },
      })
    })

    it("shows an error message", async () => {
      await apiMock({
        mockedRequest: {
          method: "get",
          route: "/players",
          response: "Network Error",
        },
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
        await apiMock({
          mockedRequest: {
            method: "get",
            route: "/players",
            response: "Network Error",
          },
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
      await apiMock({
        mockedRequest: {
          method: "get",
          route: "/players",
          response: "Network Error",
        },
        test: async () => {
          ERTL.renderRouter("src/app")

          await ERTL.waitFor(() => expect(ERTL.screen).toShowText("Reload"))
        },
      })
    })

    describe("when the error reload button is tapped", () => {
      it("removes the error message", async () => {
        await apiMock({
          mockedRequest: {
            method: "get",
            route: "/players",
            response: "Network Error",
          },
          test: async server => {
            ERTL.renderRouter("src/app")

            await ERTL.waitFor(() => expect(ERTL.screen).toShowText("Reload"))

            await apiMock({
              server,
              mockedRequest: {
                method: "get",
                route: "/players",
                response: "Network Error",
              },
              test: async () => {
                ERTL.fireEvent.press(ERTL.screen.getByText("Reload"))

                await ERTL.waitFor(() =>
                  expect(ERTL.screen).not.toShowText(
                    "Trouble Connecting to the Internet",
                  ),
                )
              },
            })
          },
        })
      })

      it("removes the reload button", async () => {
        await apiMock({
          mockedRequest: {
            method: "get",
            route: "/players",
            response: "Network Error",
          },
          test: async server => {
            ERTL.renderRouter("src/app")

            await ERTL.waitFor(() => expect(ERTL.screen).toShowText("Reload"))

            await apiMock({
              server,
              mockedRequest: {
                method: "get",
                route: "/players",
                response: "Network Error",
              },
              test: async () => {
                ERTL.fireEvent.press(ERTL.screen.getByText("Reload"))

                await ERTL.waitFor(() =>
                  expect(ERTL.screen).not.toShowText("Reload"),
                )
              },
            })
          },
        })
      })

      it("shows a loading spinner", async () => {
        await apiMock({
          mockedRequest: {
            method: "get",
            route: "/players",
            response: "Network Error",
          },
          test: async server => {
            ERTL.renderRouter("src/app")

            await ERTL.waitFor(() => expect(ERTL.screen).toShowText("Reload"))

            await apiMock({
              server,
              mockedRequest: {
                method: "get",
                route: "/players",
                response: "Network Error",
              },
              test: async () => {
                ERTL.fireEvent.press(ERTL.screen.getByText("Reload"))

                await ERTL.waitFor(() =>
                  expect(ERTL.screen).toShowTestID("Loading Spinner"),
                )
              },
            })
          },
        })
      })

      describe("when the reload finishes", () => {
        it("shows players", async () => {
          await apiMock({
            mockedRequest: {
              method: "get",
              route: "/players",
              response: "Network Error",
            },
            test: async server => {
              ERTL.renderRouter("src/app")

              await ERTL.waitFor(() => expect(ERTL.screen).toShowText("Reload"))

              await apiMock({
                server,
                mockedRequest: {
                  method: "get",
                  route: "/players",
                  response: [playerFactory({ name: "Kelly Kapoor" })],
                },
                test: async () => {
                  ERTL.fireEvent.press(ERTL.screen.getByText("Reload"))

                  await ERTL.waitFor(() =>
                    expect(ERTL.screen).toShowText("Kelly Kapoor"),
                  )
                },
              })
            },
          })
        })
      })
    })
  })

  describe("when the player list is pulled down", () => {
    it("shows refreshed players", async () => {
      await apiMock({
        mockedRequest: {
          method: "get",
          route: "/players",
          response: [
            playerFactory({ name: "Jim Halpert" }),
            playerFactory({ name: "Dwight Schrute" }),
          ],
        },
        test: async server => {
          ERTL.renderRouter("src/app")

          await ERTL.waitFor(() => {
            expect(ERTL.screen).toShowText("Jim Halpert")
            expect(ERTL.screen).toShowText("Dwight Schrute")
          })

          await apiMock({
            server,
            mockedRequest: {
              method: "get",
              route: "/players",
              response: [
                playerFactory({ name: "Michael Scott" }),
                playerFactory({ name: "Stanley Hudson" }),
              ],
            },
            test: async () => {
              await ERTL.act(() =>
                ERTL.screen
                  .getByTestId("Player List")
                  .props.refreshControl.props.onRefresh(),
              )

              await ERTL.waitFor(() => {
                expect(ERTL.screen).toShowText("Michael Scott")
                expect(ERTL.screen).toShowText("Stanley Hudson")
              })
            },
          })
        },
      })
    })

    describe("when there is a network problem refreshing players", () => {
      it("shows an error message", async () => {
        await apiMock({
          mockedRequest: {
            method: "get",
            route: "/players",
            response: [
              playerFactory({ name: "Jim Halpert" }),
              playerFactory({ name: "Dwight Schrute" }),
            ],
          },
          test: async server => {
            ERTL.renderRouter("src/app")

            await ERTL.waitFor(() => {
              expect(ERTL.screen).toShowText("Jim Halpert")
              expect(ERTL.screen).toShowText("Dwight Schrute")
            })

            await apiMock({
              server,
              mockedRequest: {
                method: "get",
                route: "/players",
                response: "Network Error",
              },
              test: async () => {
                await ERTL.act(() =>
                  ERTL.screen
                    .getByTestId("Player List")
                    .props.refreshControl.props.onRefresh(),
                )

                await ERTL.waitFor(() => {
                  expect(ERTL.screen).toShowText(
                    "Trouble Connecting to the Internet",
                  )
                })
              },
            })
          },
        })
      })

      it("keeps showing the players that were successfully fetched before the failed refresh", async () => {
        await apiMock({
          mockedRequest: {
            method: "get",
            route: "/players",
            response: [
              playerFactory({ name: "Jim Halpert" }),
              playerFactory({ name: "Dwight Schrute" }),
            ],
          },
          test: async server => {
            ERTL.renderRouter("src/app")

            await ERTL.waitFor(() => {
              expect(ERTL.screen).toShowText("Jim Halpert")
              expect(ERTL.screen).toShowText("Dwight Schrute")
            })

            await apiMock({
              server,
              mockedRequest: {
                method: "get",
                route: "/players",
                response: "Network Error",
              },
              test: async () => {
                await ERTL.act(() =>
                  ERTL.screen
                    .getByTestId("Player List")
                    .props.refreshControl.props.onRefresh(),
                )

                await ERTL.waitFor(() => {
                  expect(ERTL.screen).toShowText("Jim Halpert")
                  expect(ERTL.screen).toShowText("Dwight Schrute")
                })
              },
            })
          },
        })
      })
    })
  })
})
