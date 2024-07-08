import * as ExpoRouter from "expo-router"
import * as ExpoVectorIcons from "@expo/vector-icons"
import { View } from "react-native"

const Team = (): React.ReactElement => (
  <View style={{ flex: 1 }}>
    <ExpoRouter.Tabs screenOptions={{ headerShown: false }}>
      <ExpoRouter.Tabs.Screen
        name="players"
        options={{
          title: "Team",
          tabBarLabelStyle: { fontSize: 12 },
          tabBarIcon: ({ color }) => (
            <ExpoVectorIcons.FontAwesome6
              name="people-group"
              color={color}
              size={23}
            />
          ),
        }}
      />
      <ExpoRouter.Tabs.Screen
        name="games"
        options={{
          title: "Games",
          tabBarLabelStyle: { fontSize: 12 },
          tabBarIcon: ({ color }) => (
            <ExpoVectorIcons.FontAwesome
              name="calendar"
              color={color}
              size={23}
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
  </View>
)

export default Team
