import React from "react"
import CenteredLoadingSpinner from "components/CenteredLoadingSpinner"
import CenteredReloadButton from "components/CenteredReloadButton"
import type { ListComponent } from "types/ListComponent"
import type { RefreshableRequest } from "types/RefreshableRequest"
import useNavigationHeaderToastNotification from "hooks/useNavigationHeaderToastNotification"
import useApi from "hooks/useApi"

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

  const { getResource } = useApi()

  const loadResources = React.useCallback(async (): Promise<void> => {
    setRefreshableResources({ status: "Loading" })
    getResource<Resource[]>({
      resourceApiPath,
      onSuccess: data => {
        setRefreshableResources({
          status: "Success",
          data,
        })
      },
      onFailure: () => {
        setRefreshableResources({ status: "Load Error" })
      },
    })
  }, [resourceApiPath, setRefreshableResources, getResource])

  const refreshResources = React.useCallback(
    async (resourcesBeforeRefresh: Resource[]): Promise<void> => {
      setRefreshableResources({
        status: "Refreshing",
        data: resourcesBeforeRefresh,
      })
      getResource<Resource[]>({
        resourceApiPath,
        onSuccess: data => {
          setRefreshableResources({
            status: "Success",
            data,
          })
        },
        onFailure: () => {
          setRefreshableResources({
            status: "Refresh Error",
            data: resourcesBeforeRefresh,
          })
        },
      })
    },
    [getResource, resourceApiPath, setRefreshableResources],
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
