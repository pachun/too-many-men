import type { Team } from "types/Team"
import type { UnstableSettings } from "types/UnstableSettings"
import { mockRequest } from "spec/specHelpers/mockApi"
import type { Player } from "types/Player"

const mockGetPlayersToKeepBackButtonsWorkingAfterDeepLink = ({
  apiToken,
  team,
  unstable_settings:
    _unusedButCalledOutHereToShowTheNeedForTheMockInThisFunction,
  response = [],
}: {
  apiToken: string
  team: Team
  unstable_settings: UnstableSettings
  response?: Player[]
}): void => {
  mockRequest({
    apiToken,
    method: "get",
    path: `/teams/${team.id}/players`,
    response,
  })
}

export default mockGetPlayersToKeepBackButtonsWorkingAfterDeepLink
