import mockApi from "../specHelpers/mockApi"
import type { MockedGetGameRequestResponse, Test } from "../specHelpers/mockApi"

import * as MSW_NODE from "msw/node"

const mockGameFromApi = async ({
  server = MSW_NODE.setupServer(),
  gameId,
  response,
  test,
}: {
  server?: MSW_NODE.SetupServer
  gameId: number
  response: MockedGetGameRequestResponse
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
