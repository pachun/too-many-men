import mockApi from "../specHelpers/mockApi"
import type { MockedGameRequestResponse, Test } from "../specHelpers/mockApi"

import * as MSW_NODE from "msw/node"

const mockGamesFromApi = async ({
  server = MSW_NODE.setupServer(),
  response,
  test,
}: {
  server?: MSW_NODE.SetupServer
  response: MockedGameRequestResponse
  test: Test
}): Promise<void> => {
  await mockApi({
    server,
    mockedRequests: [
      {
        method: "get",
        route: "/games",
        response,
      },
    ],
    test,
  })
}

export default mockGamesFromApi
