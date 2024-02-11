import * as MSW_NODE from "msw/node"
import * as MSW from "msw"
import Config from "Config"
import type { Player } from "types/Player"
import type { Game } from "types/Game"

export type MockedPlayerRequestResponse = Player[] | "Network Error"
export interface MockedPlayersRequest {
  method: "get"
  route: "/players"
  response: MockedPlayerRequestResponse
}

export type MockedGameRequestResponse = Game[] | "Network Error"
export interface MockedGamesRequest {
  method: "get"
  route: "/games"
  response: MockedGameRequestResponse
}

export type MockedRequest = MockedPlayersRequest | MockedGamesRequest
export type Test = (server: MSW_NODE.SetupServer) => Promise<void>

interface MockApiArguments {
  server?: MSW_NODE.SetupServer
  mockedRequests: MockedRequest[]
  test: Test
}

const mockApi = async ({
  server = MSW_NODE.setupServer(),
  mockedRequests,
  test,
}: MockApiArguments): Promise<void> => {
  mockedRequests.forEach(({ method, route, response }) => {
    server.use(
      MSW.http[method](
        Config.apiUrl + route,
        () => {
          if (response === "Network Error") {
            return MSW.HttpResponse.error()
          } else {
            return MSW.HttpResponse.json(response)
          }
        },
        { once: true },
      ),
    )
  })
  server.listen({ onUnhandledRequest: "error" })
  try {
    await test(server)
  } finally {
    server.close()
  }
}

export default mockApi
