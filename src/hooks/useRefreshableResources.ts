import React from "react"
import type { RefreshableRequest } from "types/RefreshableRequest"
import NavigationHeaderToastNotification from "components/NavigationHeaderToastNotification"
import Config from "Config"

interface UseRefreshableResourcesReturnType<Resource> {
  refreshableResources: RefreshableRequest<Resource[]>
  loadResources: () => Promise<void>
  refreshResources: (resourcesBeforeRefresh: Resource[]) => Promise<void>
}

const useRefreshableResources = <Resource>(
  resourceApiPath: string,
): UseRefreshableResourcesReturnType<Resource> => {
  const resourceUrl = React.useMemo(
    () => Config.apiUrl + resourceApiPath,
    [resourceApiPath],
  )

  const [refreshableResources, setRefreshableResources] = React.useState<
    RefreshableRequest<Resource[]>
  >({
    status: "Not Started",
  })

  const { showNotification } = React.useContext(
    NavigationHeaderToastNotification.Context,
  )

  const loadResources = React.useCallback(async (): Promise<void> => {
    setRefreshableResources({ status: "Loading" })
    try {
      setRefreshableResources({
        status: "Success",
        data: await (await fetch(resourceUrl)).json(),
      })
    } catch {
      showNotification({
        type: "warning",
        message: "Trouble Connecting to the Internet",
      })
      setRefreshableResources({ status: "Load Error" })
    }
  }, [showNotification, resourceUrl])

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
      } catch {
        showNotification({
          type: "warning",
          message: "Trouble Connecting to the Internet",
        })
        setRefreshableResources({
          status: "Refresh Error",
          data: resourcesBeforeRefresh,
        })
      }
    },
    [showNotification, resourceUrl],
  )

  return { refreshableResources, loadResources, refreshResources }
}

export default useRefreshableResources
