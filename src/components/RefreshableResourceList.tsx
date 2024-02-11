import React from "react"
import NavigationHeaderToastNotification from "components/NavigationHeaderToastNotification"
import CenteredLoadingSpinner from "components/CenteredLoadingSpinner"
import CenteredReloadButton from "components/CenteredReloadButton"
import useRefreshableResources from "hooks/useRefreshableResources"
import type { ListComponent } from "types/ListComponent"

interface RefreshableResourceListProps<Resource> {
  resourceApiPath: string
  ListComponent: ListComponent<Resource>
}

const RefreshableResourceList = <Resource,>({
  resourceApiPath,
  ListComponent,
}: RefreshableResourceListProps<Resource>): React.ReactElement => {
  const { dismissNotification } = React.useContext(
    NavigationHeaderToastNotification.Context,
  )

  const {
    refreshableResources: refreshableResources,
    loadResources: loadResources,
    refreshResources: refreshResources,
  } = useRefreshableResources<Resource>(resourceApiPath)

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
