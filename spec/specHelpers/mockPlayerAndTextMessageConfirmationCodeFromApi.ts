import * as MSW_NODE from "msw/node"
import mockApi from "../specHelpers/mockApi"
import type { MockedPlayerRequestResponse, Test } from "../specHelpers/mockApi"
import type { CheckTextMessageConfirmationCodeRequestResponse } from "types/CheckTextMessageConfirmationCodeRequestResponse"

const mockPlayerAndTextMessageConfirmationCodeFromApi = async ({
  server = MSW_NODE.setupServer(),
  playerId,
  confirmationCode = "",
  checkTextMessageConfirmationCodeRequestResponse = { status: "incorrect" },
  response,
  test,
}: {
  server?: MSW_NODE.SetupServer
  playerId: number
  confirmationCode?: string
  checkTextMessageConfirmationCodeRequestResponse?: CheckTextMessageConfirmationCodeRequestResponse
  response: MockedPlayerRequestResponse
  test: Test
}): Promise<string[]> => {
  return await mockApi({
    server,
    mockedRequests: [
      {
        method: "get",
        route: "/players/[id]",
        params: { id: playerId },
        response,
      },
      {
        method: "get",
        route: "/players/[id]/send_text_message_confirmation_code",
        params: { id: playerId },
        response: undefined,
      },
      {
        method: "post",
        route:
          "/players/[id]/check_text_message_confirmation_code?confirmation_code=[confirmationCode]",
        params: { id: playerId, confirmationCode: confirmationCode },
        response: checkTextMessageConfirmationCodeRequestResponse,
      },
    ],
    test,
  })
}

export default mockPlayerAndTextMessageConfirmationCodeFromApi
