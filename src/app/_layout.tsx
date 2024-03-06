import React from "react"
import * as ExpoRouter from "expo-router"
import * as ExpoStatusBar from "expo-status-bar"
import * as ExpoVectorIcons from "@expo/vector-icons"
import * as ReactNavigationNative from "@react-navigation/native"
import NavigationHeaderToastNotification from "components/NavigationHeaderToastNotification"
import useOverTheAirUpdates from "hooks/useOverTheAirUpdates"
import useTheme from "hooks/useTheme"
import { initializeAptabase, trackAptabaseEvent } from "helpers/aptabase"
import RefreshableGamesContext from "components/GamesProvider"
import RefreshablePlayersContext from "components/PlayersProvider"
import type { Player } from "types/Player"
import type { RefreshableRequest } from "types/RefreshableRequest"
import type { Game } from "types/Game"

initializeAptabase()

const Layout = (): React.ReactElement => {
  React.useEffect(() => {
    trackAptabaseEvent("App Launched")
  }, [])

  useOverTheAirUpdates()

  const theme = useTheme()

  const [refreshablePlayers, setRefreshablePlayers] = React.useState<
    RefreshableRequest<Player[]>
  >({
    status: "Not Started",
  })

  const [refreshableGames, setRefreshableGames] = React.useState<
    RefreshableRequest<Game[]>
  >({
    status: "Not Started",
  })

  return (
    <>
      <ExpoStatusBar.StatusBar style="auto" />
      <ReactNavigationNative.ThemeProvider value={theme}>
        <RefreshableGamesContext.Provider
          value={{ refreshableGames, setRefreshableGames }}
        >
          <RefreshablePlayersContext.Provider
            value={{ refreshablePlayers, setRefreshablePlayers }}
          >
            <NavigationHeaderToastNotification.Provider>
              <ExpoRouter.Tabs screenOptions={{ headerShown: false }}>
                <ExpoRouter.Tabs.Screen
                  name="players"
                  options={{
                    title: "Team",
                    tabBarIcon: ({ color }) => (
                      <ExpoVectorIcons.FontAwesome6
                        name="people-group"
                        color={color}
                        size={20}
                      />
                    ),
                  }}
                />
                <ExpoRouter.Tabs.Screen
                  name="games"
                  options={{
                    title: "Games",
                    tabBarIcon: ({ color }) => (
                      <ExpoVectorIcons.FontAwesome
                        name="calendar"
                        color={color}
                        size={20}
                      />
                    ),
                  }}
                />
                <ExpoRouter.Tabs.Screen
                  name="index"
                  options={{
                    href: null,
                  }}
                />
              </ExpoRouter.Tabs>
            </NavigationHeaderToastNotification.Provider>
          </RefreshablePlayersContext.Provider>
        </RefreshableGamesContext.Provider>
      </ReactNavigationNative.ThemeProvider>
    </>
  )
}

export default Layout
