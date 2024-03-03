import mockApi from "../specHelpers/mockApi"
import type { MockedPlayerRequestResponse, Test } from "../specHelpers/mockApi"

import * as MSW_NODE from "msw/node"

const mockPlayerFromApi = async ({
  server = MSW_NODE.setupServer(),
  playerId,
  response,
  test,
}: {
  server?: MSW_NODE.SetupServer
  playerId: number
  response: MockedPlayerRequestResponse
  test: Test
}): Promise<void> => {
  await mockApi({
    server,
    mockedRequests: [
      {
        method: "get",
        route: "/players/[id]",
        params: { id: playerId },
        response,
      },
    ],
    test,
  })
}

export default mockPlayerFromApi
