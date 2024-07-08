import React from "react"
import type { RefreshableRequest } from "types/RefreshableRequest"
import Config from "Config"
import { trackAptabaseEvent } from "helpers/aptabase"
import useNavigationHeaderToastNotification from "hooks/useNavigationHeaderToastNotification"
import useApiToken from "hooks/useApiToken"

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

  const { apiToken } = useApiToken()

  const getJsonResources = React.useCallback(async (): Promise<Resource[]> => {
    return await (
      await fetch(resourceUrl, {
        headers: { "ApiToken": apiToken!, "Content-Type": "Application/JSON" },
      })
    ).json()
  }, [resourceUrl, apiToken])

  const { showNotification } = useNavigationHeaderToastNotification()

  const loadResources = React.useCallback(async (): Promise<void> => {
    if (apiToken) {
      setRefreshableResources({ status: "Loading" })
      try {
        setRefreshableResources({
          status: "Success",
          data: await getJsonResources(),
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
    }
  }, [
    apiToken,
    showNotification,
    resourceApiPath,
    setRefreshableResources,
    getJsonResources,
  ])

  const refreshResources = React.useCallback(
    async (resourcesBeforeRefresh: Resource[]): Promise<void> => {
      if (apiToken) {
        setRefreshableResources({
          status: "Refreshing",
          data: resourcesBeforeRefresh,
        })
        try {
          setRefreshableResources({
            status: "Success",
            data: await getJsonResources(),
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
      }
    },
    [
      apiToken,
      showNotification,
      resourceApiPath,
      setRefreshableResources,
      getJsonResources,
    ],
  )

  return { loadResources, refreshResources }
}

export default useRefreshableResources
