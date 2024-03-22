import mockApi from "../specHelpers/mockApi"
import type { MockedGameRequestResponse, Test } from "../specHelpers/mockApi"

import * as MSW_NODE from "msw/node"

const mockGameFromApi = async ({
  server = MSW_NODE.setupServer(),
  gameId,
  response,
  test,
}: {
  server?: MSW_NODE.SetupServer
  gameId: number
  response: MockedGameRequestResponse
  test: Test
}): Promise<void> => {
  await mockApi({
    server,
    mockedRequests: [
      {
        method: "get",
        route: "/games/[id]",
        params: { id: gameId },
        response,
      },
    ],
    test,
  })
}

export default mockGameFromApi
