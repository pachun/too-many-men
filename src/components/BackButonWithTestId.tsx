import * as ReactNative from "react-native"
import * as ExpoRouter from "expo-router"
import * as ExpoVectorIcons from "@expo/vector-icons"
import color from "helpers/color"

interface BackButtonWithTestIdProps {
  title: string
}

const BackButtonWithTestId = ({
  title,
}: BackButtonWithTestIdProps): React.ReactElement => {
  const router = ExpoRouter.useRouter()

  return (
    <ReactNative.Pressable
      testID="Back Button"
      onPress={() => router.back()}
      style={{ flexDirection: "row", alignItems: "flex-end" }}
    >
      <ExpoVectorIcons.FontAwesome6
        name="chevron-left"
        size={22}
        color={color("purple")}
      />
      <ReactNative.View style={{ width: 5 }} />
      <ReactNative.Text style={{ color: color("purple"), fontSize: 18 }}>
        {title}
      </ReactNative.Text>
    </ReactNative.Pressable>
  )
}

export default BackButtonWithTestId
