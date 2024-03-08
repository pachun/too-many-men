import mockApi from "../specHelpers/mockApi"
import type { MockedPlayerRequestResponse, Test } from "../specHelpers/mockApi"

import * as MSW_NODE from "msw/node"

const mockPlayerAndTextMessageConfirmationCodeFromApi = async ({
  server = MSW_NODE.setupServer(),
  playerId,
  response,
  test,
}: {
  server?: MSW_NODE.SetupServer
  playerId: number
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
    ],
    test,
  })
}

export default mockPlayerAndTextMessageConfirmationCodeFromApi
