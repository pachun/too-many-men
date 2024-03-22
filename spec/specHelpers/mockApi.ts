import * as MSW_NODE from "msw/node"
import * as MSW from "msw"
import Config from "Config"
import type { Player } from "types/Player"
import type { Game } from "types/Game"
import type { CheckTextMessageConfirmationCodeRequestResponse } from "types/CheckTextMessageConfirmationCodeRequestResponse"

export interface MockedCheckPlayersTextMessageConfirmationCodeRequest {
  method: "post"
  route: "/players/[id]/check_text_message_confirmation_code"
  searchParams: { confirmation_code: string }
  params: { id: number }
  response: CheckTextMessageConfirmationCodeRequestResponse
}

export interface MockedSendPlayersTextMessageConfirmationCodeRequest {
  method: "get"
  route: "/players/[id]/send_text_message_confirmation_code"
  params: { id: number }
  response: undefined
}

export type MockedGameRequestResponse = Game | "Network Error"
export interface MockedGameRequest {
  method: "get"
  route: "/games/[id]"
  params: { id: number }
  response: MockedGameRequestResponse
}

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
  | MockedGameRequest
  | MockedSendPlayersTextMessageConfirmationCodeRequest
  | MockedCheckPlayersTextMessageConfirmationCodeRequest
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

const url = (mockedRequest: MockedRequest): string => {
  return (
    Config.apiUrl +
    // @ts-ignore
    (mockedRequest.params
      ? // @ts-ignore
        toPath(mockedRequest.route, mockedRequest.params)
      : mockedRequest.route)
  )
}

const mockApi = async ({
  server = MSW_NODE.setupServer(),
  mockedRequests,
  test,
}: MockApiArguments): Promise<string[]> => {
  let urlsOfApiRequests: string[] = []
  server.events.on("request:match", ({ request }) => {
    urlsOfApiRequests = [...urlsOfApiRequests, request.url]
  })

  mockedRequests.forEach(mockedRequest => {
    server.use(
      MSW.http[mockedRequest.method](
        url(mockedRequest),
        // @ts-ignore
        ({ request }) => {
          if (mockedRequest.response === "Network Error") {
            return MSW.HttpResponse.error()
          } else {
            // @ts-ignore
            if (mockedRequest.searchParams) {
              const url = new URL(request.url)
              // @ts-ignore
              Object.keys(mockedRequest.searchParams).forEach(searchParam => {
                expect(url.searchParams.get(searchParam)).toEqual(
                  // @ts-ignore
                  mockedRequest.searchParams[searchParam],
                )
              })
              return MSW.HttpResponse.json(mockedRequest.response)
            } else {
              return MSW.HttpResponse.json(mockedRequest.response)
            }
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

  return urlsOfApiRequests
}

export default mockApi
