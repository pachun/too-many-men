import Config from "Config"
import nock from "nock"
import type { CheckTextMessageConfirmationCodeRequestResponse } from "types/CheckTextMessageConfirmationCodeRequestResponse"
import type { Team } from "types/Team"
import type { Player } from "types/Player"
import type { Game } from "types/Game"

type NetworkError = "Network Error"
type OrNetworkError<T> = T | NetworkError

export const mockRequest = ({
  method,
  path,
  response,
  apiToken,
  params,
}: {
  method: "get" | "post"
  path: string
  response?: OrNetworkError<
    | Team
    | Team[]
    | Game
    | Game[]
    | Player
    | Player[]
    | CheckTextMessageConfirmationCodeRequestResponse
  >
  apiToken?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params?: any
}): nock.Scope => {
  const request = nock(Config.apiUrl, {
    reqheaders: {
      ...(apiToken ? { ApiToken: apiToken } : {}),
      "Content-Type": "Application/JSON",
    },
  })[method](path, params)

  return response === "Network Error"
    ? request.replyWithError(response)
    : response
      ? request.reply(200, response)
      : request.reply(200)
}
