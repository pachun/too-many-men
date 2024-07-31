import React from "react"
import * as ExpoRouter from "expo-router"
import useApi from "./useApi"
import type { UnstableSettings } from "types/UnstableSettings"
import type { RefreshableRequest } from "types/RefreshableRequest"
import type { Team } from "types/Team"
import type { Game } from "types/Game"
import type { Player } from "types/Player"

type PossibleResources = Team | Game | Player

const previousScreenIsPrefetchingApiResourcesToKeepBackButtonsWorkingAfterDeepLink =
  <ResourceType extends PossibleResources>({
    unstable_settings:
      _unusedButCalledOutHereToShowTheReasonForTheCheckInThisFunction,
    refreshableResources,
  }: {
    unstable_settings: UnstableSettings
    refreshableResources: RefreshableRequest<ResourceType[]>
  }): boolean => {
    return refreshableResources.status === "Loading"
  }

const useTheCachedResourceFirstOrGetTheResourceFromTheApi = <
  ResourceType extends PossibleResources,
>(args: {
  resourceId: number
  resourceApiPath: string
  refreshableResources: RefreshableRequest<ResourceType[]>
  setRefreshableResources: (
    refreshableApiResources: RefreshableRequest<ResourceType[]>,
  ) => void
  unstable_settings: UnstableSettings
}): ResourceType | undefined => {
  const {
    resourceId,
    resourceApiPath,
    refreshableResources,
    setRefreshableResources,
    unstable_settings,
  } = args
  const [resource, setResource] = React.useState<ResourceType | undefined>()
  const { getResource } = useApi()

  ExpoRouter.useFocusEffect(
    React.useCallback(() => {
      const getApiResourceFromCacheOrApi = async (): Promise<void> => {
        const getApiResourceFromCache = (): ResourceType | undefined => {
          if (
            /* c8 ignore start */
            // This is only untested (and currently unused) because of the
            // preloading that's happening to keep back buttons working after
            // deep links are used. Git blame me.
            refreshableResources.type === "With Data"
            /* c8 ignore end */
          ) {
            return refreshableResources.data.find(
              refreshableApiResource =>
                refreshableApiResource.id === Number(resourceId),
            )
          }
        }

        const cachedApiResource = getApiResourceFromCache()

        if (cachedApiResource) {
          setResource(cachedApiResource)
        } else {
          getResource<ResourceType>({
            resourceApiPath,
            onSuccess: (resourceFromApi: ResourceType) => {
              if (resourceFromApi) {
                setRefreshableResources({
                  type: "With Data",
                  status: "Success",
                  data: [resourceFromApi],
                })
                setResource(resourceFromApi)
              }
            },
            onFailure: () => {},
          })
        }
      }

      if (
        !previousScreenIsPrefetchingApiResourcesToKeepBackButtonsWorkingAfterDeepLink<ResourceType>(
          {
            unstable_settings,
            refreshableResources: refreshableResources,
          },
        )
      ) {
        getApiResourceFromCacheOrApi()
      }
    }, [
      getResource,
      resourceApiPath,
      resourceId,
      refreshableResources,
      setRefreshableResources,
      unstable_settings,
    ]),
  )

  return resource
}

export default useTheCachedResourceFirstOrGetTheResourceFromTheApi
