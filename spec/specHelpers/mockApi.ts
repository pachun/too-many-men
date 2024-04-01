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
): MockedCreateOrUpdatePlayerAttendanceRequest => ({
  method: "post",
  route: "/games/[id]/player_attendance",
  params: { id: game.id },
  headers: { "ApiToken": apiToken, "Content-Type": "Application/JSON" },
  body: JSON.stringify({ attending: response }),
  response: error ? "Network Error" : undefined,
})

export interface MockedCheckPlayersTextMessageConfirmationCodeRequest {
  method: "post"
  route: "/players/[id]/check_text_message_confirmation_code"
  searchParams: { confirmation_code: string }
  params: { id: number }
  response: CheckTextMessageConfirmationCodeRequestResponse
}

export const mockCheckPlayersTextMessageConfirmationCode = (
  player: Player,
  confirmationCode: string,
  response: CheckTextMessageConfirmationCodeRequestResponse,
): MockedCheckPlayersTextMessageConfirmationCodeRequest => ({
  method: "post",
  route: "/players/[id]/check_text_message_confirmation_code",
  searchParams: { confirmation_code: confirmationCode },
  params: { id: player.id },
  response: response,
})

type MockedSendPlayersTextMessageConfirmationCodeRequestResponse = undefined
export interface MockedSendPlayersTextMessageConfirmationCodeRequest {
  method: "get"
  route: "/players/[id]/send_text_message_confirmation_code"
  params: { id: number }
  response: MockedSendPlayersTextMessageConfirmationCodeRequestResponse
}

export const mockSendPlayersTextMessageConfirmationCode = (
  player: Player,
): MockedSendPlayersTextMessageConfirmationCodeRequest => ({
  method: "get",
  route: "/players/[id]/send_text_message_confirmation_code",
  params: { id: player.id },
  response: undefined,
})

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
): MockedGetGameRequest => ({
  method: "get",
  route: "/games/[id]",
  params: { id: game.id },
  response: error ? "Network Error" : game,
})

export type MockedGetPlayerRequestResponse = Player | "Network Error"
export interface MockedGetPlayerRequest {
  method: "get"
  route: "/players/[id]"
  params: { id: number }
  response: MockedGetPlayerRequestResponse
}

export const mockGetPlayer = (
  player: Player,
  error?: "Network Error",
): MockedGetPlayerRequest => ({
  method: "get",
  route: "/players/[id]",
  params: { id: player.id },
  response: error ? error : player,
})

export type MockedGetPlayersRequestResponse = Player[] | "Network Error"
export interface MockedGetPlayersRequest {
  method: "get"
  route: "/players"
  response: MockedGetPlayersRequestResponse
}

export const mockGetPlayers = (
  players: Player[],
  error?: "Network Error",
): MockedGetPlayersRequest => ({
  method: "get",
  route: "/players",
  response: error ? "Network Error" : players,
})

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

const incorrectUrlParamFailureMessage = (
  url: string,
  expectedUrlParamKey: string,
  expectedUrlParam: string,
  receivedHeader: string | null,
): string =>
  `A request to ${url} has an incorrect ${expectedUrlParamKey} url param\nexpected: "${expectedUrlParam}"\nreceived: "${receivedHeader}"`

const failIfExpectedSearchParamsAreNotPresent = ({
  includedSearchParams,
  expectedSearchParams,
  breakTestOnFailureWithMessage,
  url,
}: {
  includedSearchParams: URLSearchParams
  expectedSearchParams: Record<string, string> | undefined
  breakTestOnFailureWithMessage: (message: string) => void
  url: string
}): void => {
  if (expectedSearchParams) {
    Object.keys(expectedSearchParams).forEach(expectedSearchParamKey => {
      expect(includedSearchParams.get(expectedSearchParamKey)).toEqual(
        expectedSearchParams[expectedSearchParamKey],
      )
      if (
        includedSearchParams.get(expectedSearchParamKey) !=
        expectedSearchParams[expectedSearchParamKey]
      ) {
        breakTestOnFailureWithMessage(
          incorrectUrlParamFailureMessage(
            url,
            expectedSearchParamKey,
            expectedSearchParams[expectedSearchParamKey],
            includedSearchParams.get(expectedSearchParamKey),
          ),
        )
      }
    })
  }
}

const incorrectHeaderFailureMessage = (
  url: string,
  expectedHeaderKey: string,
  expectedHeader: string,
  receivedHeader: string | null,
): string =>
  `A request to ${url} has an incorrect ${expectedHeaderKey} header\nexpected: "${expectedHeader}"\nreceived: "${receivedHeader}"`

const failIfExpectedHeadersAreNotPresent = ({
  includedHeaders,
  expectedHeaders,
  breakTestOnFailureWithMessage,
  url,
}: {
  includedHeaders: Headers
  expectedHeaders: Record<string, string> | undefined
  breakTestOnFailureWithMessage: (message: string) => void
  url: string
}): void => {
  if (expectedHeaders) {
    Object.keys(expectedHeaders).forEach(expectedHeaderKey => {
      if (
        includedHeaders.get(expectedHeaderKey) !=
        expectedHeaders[expectedHeaderKey]
      ) {
        breakTestOnFailureWithMessage(
          incorrectHeaderFailureMessage(
            url,
            expectedHeaderKey,
            expectedHeaders[expectedHeaderKey],
            includedHeaders.get(expectedHeaderKey),
          ),
        )
      }
    })
  }
}

const incorrectJsonBodyFailureMessage = (
  url: string,
  expectedJsonBody: string | undefined,
  receivedJsonBody: void | MSW.DefaultBodyType,
): string =>
  `A request to ${url} has an incorrect json body\nexpected: "${expectedJsonBody}"\nreceived: "${receivedJsonBody}"`

const failIfExpectedJsonBodyIsNotPresent = async ({
  request,
  expectedJsonBody,
  breakTestOnFailureWithMessage,
  url,
}: {
  request: MSW.StrictRequest<MSW.DefaultBodyType>
  expectedJsonBody: string | undefined
  breakTestOnFailureWithMessage: (message: string) => void
  url: string
}): Promise<void> => {
  const includedJsonBody = await request.json().catch(() => {})

  if (includedJsonBody || expectedJsonBody) {
    if (expectedJsonBody != JSON.stringify(includedJsonBody)) {
      breakTestOnFailureWithMessage(
        incorrectJsonBodyFailureMessage(
          url,
          expectedJsonBody,
          JSON.stringify(includedJsonBody),
        ),
      )
    }
  }
}

const mockApi = async ({
  server = MSW_NODE.setupServer(),
  mockedRequests,
  test,
}: MockApiArguments): Promise<string[]> => {
  // https://github.com/mswjs/msw/issues/946#issuecomment-1202959063
  const breakTestOnFailureWithMessage = (message: string): void => {
    it(`\n\n\nTHIS TEST NOT BREAKING BECAUSE YOU NESTED TESTS. IT FAILED BECAUSE:\n\n${message}\n\n\n`, () => {})
  }

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
            breakTestOnFailureWithMessage,
            url: request.url,
          })

          failIfExpectedHeadersAreNotPresent({
            includedHeaders: request.headers,
            // @ts-ignore
            expectedHeaders: mockedRequest.headers,
            breakTestOnFailureWithMessage,
            url: request.url,
          })

          await failIfExpectedJsonBodyIsNotPresent({
            request: request,
            // @ts-ignore
            expectedJsonBody: mockedRequest.body,
            breakTestOnFailureWithMessage,
            url: request.url,
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

  server.listen({
    onUnhandledRequest: request => {
      breakTestOnFailureWithMessage(
        `A REQUEST WAS MADE TO ${request.url} WHICH WAS NOT PROVISIONED FOR WITH MSW`,
      )
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
