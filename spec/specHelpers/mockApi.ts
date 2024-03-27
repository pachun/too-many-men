import * as MSW_NODE from "msw/node"
import * as MSW from "msw"
import Config from "Config"
import type { Player } from "types/Player"
import type { Game } from "types/Game"
import type { CheckTextMessageConfirmationCodeRequestResponse } from "types/CheckTextMessageConfirmationCodeRequestResponse"

export interface MockedCreateOrUpdatePlayerAttendanceRequest {
  method: "post"
  route: "/games/[id]/player_attendance"
  params: { id: number }
  headers: { "ApiToken": string; "Content-Type": "Application/JSON" }
  body: string
  response?: "Network Error" | undefined
}

export const mockCreateOrUpdatePlayerAttendance = (
  game: Game,
  apiToken: string,
  response: "Yes" | "No" | "Maybe",
  error?: "Network Error",
): MockedCreateOrUpdatePlayerAttendanceRequest => {
  return {
    method: "post",
    route: "/games/[id]/player_attendance",
    params: { id: game.id },
    headers: { "ApiToken": apiToken, "Content-Type": "Application/JSON" },
    body: JSON.stringify({ attending: response }),
    response: error ? "Network Error" : undefined,
  }
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

export type MockedGetGameRequestResponse = Game | "Network Error"
export interface MockedGetGameRequest {
  method: "get"
  route: "/games/[id]"
  params: { id: number }
  response: MockedGetGameRequestResponse
}

export const mockGetGame = (
  game: Game,
  error?: "Network Error",
): MockedGetGameRequest => {
  return {
    method: "get",
    route: "/games/[id]",
    params: { id: game.id },
    response: error ? "Network Error" : game,
  }
}

export type MockedGetPlayerRequestResponse = Player | "Network Error"
export interface MockedGetPlayerRequest {
  method: "get"
  route: "/players/[id]"
  params: { id: number }
  response: MockedGetPlayerRequestResponse
}

export type MockedGetPlayersRequestResponse = Player[] | "Network Error"
export interface MockedGetPlayersRequest {
  method: "get"
  route: "/players"
  response: MockedGetPlayersRequestResponse
}

export type MockedGetGamesRequestResponse = Game[] | "Network Error"
export interface MockedGetGamesRequest {
  method: "get"
  route: "/games"
  response: MockedGetGamesRequestResponse
}

export const mockGetGames = (
  games: Game[],
  error?: "Network Error",
): MockedGetGamesRequest => {
  return {
    method: "get",
    route: "/games",
    response: error ? "Network Error" : games,
  }
}

export type MockedRequest =
  | MockedGetPlayersRequest
  | MockedGetPlayerRequest
  | MockedGetGamesRequest
  | MockedGetGameRequest
  | MockedSendPlayersTextMessageConfirmationCodeRequest
  | MockedCheckPlayersTextMessageConfirmationCodeRequest
  | MockedCreateOrUpdatePlayerAttendanceRequest
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

const failIfExpectedJsonBodyIsNotPresent = async ({
  request,
  expectedJsonBody,
}: {
  request: MSW.StrictRequest<MSW.DefaultBodyType>
  expectedJsonBody: string | undefined
}): Promise<void> => {
  const includedJsonBody = await request.json().catch(() => {})

  if (includedJsonBody || expectedJsonBody) {
    expect(expectedJsonBody).toEqual(JSON.stringify(includedJsonBody))
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

  mockedRequests.reverse().forEach(mockedRequest => {
    server.use(
      MSW.http[mockedRequest.method](
        url(mockedRequest),
        async ({ request }) => {
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

          await failIfExpectedJsonBodyIsNotPresent({
            request: request,
            // @ts-ignore
            expectedJsonBody: mockedRequest.body,
          })

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

  // https://github.com/mswjs/msw/issues/946#issuecomment-1202959063
  server.listen({
    onUnhandledRequest: request => {
      const unhandledRequestError = (unhandledRequestUrl: string): string =>
        `THIS IS NOT ERRORING BECAUSE YOU NESTED TESTS; A REQUEST WAS MADE TO ${unhandledRequestUrl} WHICH WAS NOT PROVISIONED FOR WITH MSW`
      it(unhandledRequestError(request.url), () => {})
    },
  })

  try {
    await test(server)
  } finally {
    server.close()
  }

  return urlsOfApiRequests
}

export default mockApi
