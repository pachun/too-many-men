import mockApi from "../specHelpers/mockApi"
import type { MockedPlayerRequestResponse, Test } from "../specHelpers/mockApi"

import * as MSW_NODE from "msw/node"

const mockPlayersFromApi = async ({
  server = MSW_NODE.setupServer(),
  response,
  test,
}: {
  server?: MSW_NODE.SetupServer
  response: MockedPlayerRequestResponse
  test: Test
}): Promise<void> => {
  await mockApi({
    server,
    mockedRequests: [
      {
        method: "get",
        route: "/players",
        response,
      },
    ],
    test,
  })
}

export default mockPlayersFromApi
