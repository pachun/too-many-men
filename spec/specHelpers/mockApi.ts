import * as MSW_NODE from "msw/node"
import * as MSW from "msw"
import Config from "Config"
import type { Player } from "types/Player"
import type { Game } from "types/Game"

export type MockedPlayerRequestResponse = Player | "Network Error"
export interface MockedPlayerRequest {
  method: "get"
  route: "/players/[id]"
  params: { id: number }
  response: MockedPlayerRequestResponse
}

export type MockedPlayersRequestResponse = Player[] | "Network Error"
export interface MockedPlayersRequest {
  method: "get"
  route: "/players"
  response: MockedPlayersRequestResponse
}

export type MockedGamesRequestResponse = Game[] | "Network Error"
export interface MockedGamesRequest {
  method: "get"
  route: "/games"
  response: MockedGamesRequestResponse
}

export type MockedRequest =
  | MockedPlayersRequest
  | MockedPlayerRequest
  | MockedGamesRequest
export type Test = (server: MSW_NODE.SetupServer) => Promise<void>

interface MockApiArguments {
  server?: MSW_NODE.SetupServer
  mockedRequests: MockedRequest[]
  test: Test
}

const toPath = (
  route: string,
  params: Record<string, string | number>,
): string => {
  return Object.entries(params).reduce((path, currentParam) => {
    const [paramName, paramValue] = currentParam
    return path.split(`[${paramName}]`).join(`${paramValue}`)
  }, route)
}

const mockApi = async ({
  server = MSW_NODE.setupServer(),
  mockedRequests,
  test,
}: MockApiArguments): Promise<void> => {
  mockedRequests.forEach(mockedRequest => {
    server.use(
      MSW.http[mockedRequest.method](
        Config.apiUrl +
          // @ts-ignore
          (mockedRequest.params
            ? // @ts-ignore
              toPath(mockedRequest.route, mockedRequest.params)
            : mockedRequest.route),
        () => {
          if (mockedRequest.response === "Network Error") {
            return MSW.HttpResponse.error()
          } else {
            return MSW.HttpResponse.json(mockedRequest.response)
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
