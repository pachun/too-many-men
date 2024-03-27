import React from "react"
import CenteredLoadingSpinner from "components/CenteredLoadingSpinner"
import CenteredReloadButton from "components/CenteredReloadButton"
import useRefreshableResources from "hooks/useRefreshableResources"
import type { ListComponent } from "types/ListComponent"
import type { RefreshableRequest } from "types/RefreshableRequest"
import useNavigationHeaderToastNotification from "hooks/useNavigationHeaderToastNotification"

interface RefreshableResourceListProps<Resource> {
  resourceApiPath: string
  refreshableResources: RefreshableRequest<Resource[]>
  setRefreshableResources: (
    refreshableResources: RefreshableRequest<Resource[]>,
  ) => void
  ListComponent: ListComponent<Resource>
}

function RefreshableResourceList<Resource>({
  resourceApiPath,
  refreshableResources,
  setRefreshableResources,
  ListComponent,
}: RefreshableResourceListProps<Resource>): React.ReactElement {
  const { dismissNotification } = useNavigationHeaderToastNotification()

  const { loadResources, refreshResources } = useRefreshableResources<Resource>(
    resourceApiPath,
    setRefreshableResources,
  )

  React.useEffect(() => {
    loadResources()
  }, [loadResources])

  return (
    <>
      {(refreshableResources.status === "Not Started" ||
        refreshableResources.status === "Loading") && (
        <CenteredLoadingSpinner />
      )}

      {(refreshableResources.status === "Success" ||
        refreshableResources.status === "Refreshing" ||
        refreshableResources.status === "Refresh Error") && (
        <ListComponent
          data={refreshableResources.data}
          isRefreshing={refreshableResources.status === "Refreshing"}
          onRefresh={() => refreshResources(refreshableResources.data)}
        />
      )}

      {refreshableResources.status === "Load Error" && (
        <CenteredReloadButton
          onPress={() => {
            dismissNotification()
            loadResources()
          }}
        />
      )}
    </>
  )
}

export default RefreshableResourceList
