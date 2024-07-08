import React from "react"
import * as ReactNative from "react-native"
import * as ExpoRouter from "expo-router"
import useTheme from "hooks/useTheme"
import type { Team } from "types/Team"
import AppText from "components/AppText"

export const paddingLeft = 10

interface TeamListItemProps {
  team: Team
}

const TeamListItem = ({ team }: TeamListItemProps): React.ReactElement => {
  const theme = useTheme()
  const currentPathname = ExpoRouter.usePathname()

  const [isTappingTeam, setIsTappingTeam] = React.useState(false)

  return (
    <ExpoRouter.Link href={`${currentPathname}/${team.id}`} asChild>
      <ReactNative.Pressable
        style={{
          paddingTop: 15,
          paddingBottom: 15,
          paddingLeft,
          width: "100%",
          ...(isTappingTeam
            ? {
                backgroundColor: theme.colors.listItemTapHighlightColor,
              }
            : {}),
        }}
        onPressIn={() => setIsTappingTeam(true)}
        onPressOut={() => setIsTappingTeam(false)}
        testID="Team List Item"
      >
        <ReactNative.View
          style={{
            flex: 1,
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "space-between",
            paddingRight: 10,
          }}
        >
          <AppText>{team.name}</AppText>
        </ReactNative.View>
      </ReactNative.Pressable>
    </ExpoRouter.Link>
  )
}

export default TeamListItem
