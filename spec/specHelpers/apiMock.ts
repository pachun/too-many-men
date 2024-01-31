import * as MSW_NODE from "msw/node"
import * as MSW from "msw"
import Config from "Config"
import type { Player } from "types/Player"

interface MockedRequestType {
  method: "get"
  route: "/players"
  response: Player[] | "Network Error"
}

interface ApiMockArguments {
  server?: MSW_NODE.SetupServer
  mockedRequest: MockedRequestType
  test: (server: MSW_NODE.SetupServer) => Promise<void>
}

const apiMock = async ({
  server = MSW_NODE.setupServer(),
  mockedRequest: { method, route, response },
  test,
}: ApiMockArguments): Promise<void> => {
  server.resetHandlers(
    MSW.http[method](
      Config.apiUrl + route,
      () => {
        if (response === "Network Error") {
          return MSW.HttpResponse.error()
        } else {
          return MSW.HttpResponse.json(response)
        }
      },
      { once: true },
    ),
  )
  server.listen({ onUnhandledRequest: "error" })
  try {
    await test(server)
  } finally {
    server.close()
  }
}

export default apiMock
