import React from "react"
import type { RefreshableRequest } from "types/RefreshableRequest"
import Config from "Config"
import { trackAptabaseEvent } from "helpers/aptabase"
import useNavigationHeaderToastNotification from "hooks/useNavigationHeaderToastNotification"

interface UseRefreshableResourcesReturnType<Resource> {
  loadResources: () => Promise<void>
  refreshResources: (resourcesBeforeRefresh: Resource[]) => Promise<void>
}

const useRefreshableResources = <Resource>(
  resourceApiPath: string,
  setRefreshableResources: (
    refreshableResources: RefreshableRequest<Resource[]>,
  ) => void,
): UseRefreshableResourcesReturnType<Resource> => {
  const resourceUrl = React.useMemo(
    () => Config.apiUrl + resourceApiPath,
    [resourceApiPath],
  )

  const { showNotification } = useNavigationHeaderToastNotification()

  const loadResources = React.useCallback(async (): Promise<void> => {
    setRefreshableResources({ status: "Loading" })
    try {
      setRefreshableResources({
        status: "Success",
        data: await (await fetch(resourceUrl)).json(),
      })
      trackAptabaseEvent(`Loaded ${resourceApiPath}`)
    } catch {
      showNotification({
        type: "warning",
        message: "Trouble Connecting to the Internet",
      })
      setRefreshableResources({ status: "Load Error" })
      trackAptabaseEvent(`Failed to load ${resourceApiPath}`)
    }
  }, [showNotification, resourceUrl, resourceApiPath, setRefreshableResources])

  const refreshResources = React.useCallback(
    async (resourcesBeforeRefresh: Resource[]): Promise<void> => {
      setRefreshableResources({
        status: "Refreshing",
        data: resourcesBeforeRefresh,
      })
      try {
        setRefreshableResources({
          status: "Success",
          data: await (await fetch(resourceUrl)).json(),
        })
        trackAptabaseEvent(`Refreshed ${resourceApiPath}`)
      } catch {
        showNotification({
          type: "warning",
          message: "Trouble Connecting to the Internet",
        })
        setRefreshableResources({
          status: "Refresh Error",
          data: resourcesBeforeRefresh,
        })
        trackAptabaseEvent(`Failed to refresh ${resourceApiPath}`)
      }
    },
    [showNotification, resourceUrl, resourceApiPath, setRefreshableResources],
  )

  return { loadResources, refreshResources }
}

export default useRefreshableResources
