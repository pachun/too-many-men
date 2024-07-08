import React from "react"
import emptyFunctionForInitializingContexts from "helpers/emptyFunctionForInitializingContexts"
import type { Provider as ProviderType } from "types/Provider"
import type { Team } from "types/Team"
import type { RefreshableRequest } from "types/RefreshableRequest"

export interface RefreshableTeamsContextType {
  refreshableTeams: RefreshableRequest<Team[]>
  setRefreshableTeams: (refreshableTeams: RefreshableRequest<Team[]>) => void
}

export const RefreshableTeamsContext =
  React.createContext<RefreshableTeamsContextType>({
    refreshableTeams: { status: "Not Started" },
    setRefreshableTeams: emptyFunctionForInitializingContexts,
  })

const RefreshableTeamsProvider: ProviderType = ({ children }) => {
  const [refreshableTeams, setRefreshableTeams] = React.useState<
    RefreshableRequest<Team[]>
  >({
    status: "Not Started",
  })

  return (
    <RefreshableTeamsContext.Provider
      value={{ refreshableTeams, setRefreshableTeams }}
    >
      {children}
    </RefreshableTeamsContext.Provider>
  )
}

export default RefreshableTeamsProvider
