import * as ReactNative from "react-native"
import * as ExpoRouter from "expo-router"
import * as ExpoVectorIcons from "@expo/vector-icons"
import useTheme from "hooks/useTheme"

interface BackButtonWithTestIdProps {
  title: string
}

const BackButtonWithTestId = ({
  title,
}: BackButtonWithTestIdProps): React.ReactElement => {
  const theme = useTheme()
  const router = ExpoRouter.useRouter()

  return (
    <ReactNative.Pressable
      hitSlop={50}
      testID="Back Button"
      onPress={() => router.back()}
      style={{ flexDirection: "row", alignItems: "flex-end" }}
    >
      <ExpoVectorIcons.FontAwesome6
        name="chevron-left"
        size={22}
        color={theme.colors.primary}
      />
      <ReactNative.View style={{ width: 5 }} />
      <ReactNative.Text style={{ color: theme.colors.primary, fontSize: 18 }}>
        {title}
      </ReactNative.Text>
    </ReactNative.Pressable>
  )
}

export default BackButtonWithTestId
