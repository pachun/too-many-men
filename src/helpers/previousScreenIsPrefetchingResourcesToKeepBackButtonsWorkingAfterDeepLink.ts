import type { UnstableSettings } from "types/UnstableSettings"
import type { RefreshableRequest } from "types/RefreshableRequest"

const previousScreenIsPrefetchingResourcesToKeepBackButtonsWorkingAfterDeepLink =
  <Resource>({
    unstable_settings:
      _unusedButCalledOutHereToShowTheReasonForTheCheckInThisFunction,
    refreshableResources,
  }: {
    unstable_settings: UnstableSettings
    refreshableResources: RefreshableRequest<Resource>
  }): boolean => {
    return refreshableResources.status === "Loading"
  }

export default previousScreenIsPrefetchingResourcesToKeepBackButtonsWorkingAfterDeepLink
