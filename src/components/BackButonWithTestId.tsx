import * as ReactNative from "react-native"
import * as ExpoRouter from "expo-router"
import * as ExpoVectorIcons from "@expo/vector-icons"
import useTheme from "hooks/useTheme"

const IOSBackButton = ({ title }: { title: string }): React.ReactElement => {
  const theme = useTheme()
  return (
    <>
      <ExpoVectorIcons.FontAwesome6
        name="chevron-left"
        size={22}
        color={theme.colors.primary}
      />
      <ReactNative.View style={{ width: 5 }} />
      <ReactNative.Text style={{ color: theme.colors.primary, fontSize: 18 }}>
        {title}
      </ReactNative.Text>
    </>
  )
}

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
      {ReactNative.Platform.OS === "ios" ? (
        <IOSBackButton title={title} />
      ) : (
        <ExpoVectorIcons.MaterialCommunityIcons
          name="arrow-left"
          size={24}
          color={theme.colors.text}
          style={{
            // the non-android values in here are for web, which we do not test
            /* c8 ignore start */
            marginRight: ReactNative.Platform.OS === "android" ? 40 : 15,
            ...(ReactNative.Platform.OS === "web" ? { marginLeft: 15 } : {}),
            /* c8 ignore end */
          }}
        />
      )}
    </ReactNative.Pressable>
  )
}

export default BackButtonWithTestId
