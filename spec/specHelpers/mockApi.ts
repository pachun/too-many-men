import * as MSW_NODE from "msw/node"
import * as MSW from "msw"
import Config from "Config"
import type { Player } from "types/Player"
import type { Game } from "types/Game"
import type { CheckTextMessageConfirmationCodeRequestResponse } from "types/CheckTextMessageConfirmationCodeRequestResponse"

export interface MockedPlayerAttendanceRequest {
  method: "post"
  route: "/games/[id]/player_attendance"
  params: { id: number }
  headers: { "ApiToken": string; "Content-Type": "Application/JSON" }
  body: string
  response?: object
}

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
  | MockedPlayerAttendanceRequest
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

const failIfExpectedSearchParamsAreNotPresent = ({
  includedSearchParams,
  expectedSearchParams,
}: {
  includedSearchParams: URLSearchParams
  expectedSearchParams: Record<string, string> | undefined
}): void => {
  if (expectedSearchParams) {
    Object.keys(expectedSearchParams).forEach(expectedSearchParam => {
      expect(includedSearchParams.get(expectedSearchParam)).toEqual(
        expectedSearchParams[expectedSearchParam],
      )
    })
  }
}

const failIfExpectedHeadersAreNotPresent = ({
  includedHeaders,
  expectedHeaders,
}: {
  includedHeaders: Headers
  expectedHeaders: Record<string, string> | undefined
}): void => {
  if (expectedHeaders) {
    Object.keys(expectedHeaders).forEach(expectedSearchParam => {
      expect(includedHeaders.get(expectedSearchParam)).toEqual(
        expectedHeaders[expectedSearchParam],
      )
    })
  }
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
        ({ request }) => {
          if (mockedRequest.response === "Network Error") {
            return MSW.HttpResponse.error()
          } else {
            const url = new URL(request.url)

            failIfExpectedSearchParamsAreNotPresent({
              includedSearchParams: url.searchParams,
              // @ts-ignore
              expectedSearchParams: mockedRequest.searchParams,
            })

            failIfExpectedHeadersAreNotPresent({
              includedHeaders: request.headers,
              // @ts-ignore
              expectedHeaders: mockedRequest.headers,
            })

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

  return urlsOfApiRequests
}

export default mockApi
