import React from "react"
import * as ReactNavigationNative from "@react-navigation/native"
import RefreshablePlayersContext from "contexts/RefreshablePlayersContext"
import RefreshableGamesContext from "contexts/RefreshableGamesContext"
import type { Player } from "types/Player"
import type { Game } from "types/Game"
import type { RefreshableRequest } from "types/RefreshableRequest"
import useTheme from "hooks/useTheme"
import NavigationHeaderToastNotification from "./NavigationHeaderToastNotification"

interface ProvidersProps {
  children: React.ReactElement
}

const Providers = ({ children }: ProvidersProps): React.ReactElement => {
  const theme = useTheme()

  const [refreshableGames, setRefreshableGames] = React.useState<
    RefreshableRequest<Game[]>
  >({
    status: "Not Started",
  })

  const [refreshablePlayers, setRefreshablePlayers] = React.useState<
    RefreshableRequest<Player[]>
  >({
    status: "Not Started",
  })

  const ProvidersAndValues = [
    {
      provider: ReactNavigationNative.ThemeProvider,
      value: theme,
    },
    {
      provider: RefreshableGamesContext.Provider,
      value: { refreshableGames, setRefreshableGames },
    },
    {
      provider: RefreshablePlayersContext.Provider,
      value: { refreshablePlayers, setRefreshablePlayers },
    },
    {
      provider: NavigationHeaderToastNotification.Provider,
    },
  ]

  return ProvidersAndValues.reduce((acc, CurrentProviderAndValue) => {
    return (
      <CurrentProviderAndValue.provider
        // @ts-ignore
        value={CurrentProviderAndValue.value}
      >
        {acc}
      </CurrentProviderAndValue.provider>
    )
  }, children)
}

export default Providers
