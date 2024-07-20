import React from "react"
import * as ReactNative from "react-native"
import * as ExpoRouter from "expo-router"
import * as ExpoVectorIcons from "@expo/vector-icons"
import useTheme from "hooks/useTheme"
import leftNavigationBarButtonStyle from "helpers/leftNavigationBarButtonStyle"

const IOSBackButton = (props: { title: string }): React.ReactElement => {
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
        {props.title}
      </ReactNative.Text>
    </>
  )
}

const BackButtonWithTestId = (props: {
  title: string
  route: string
}): React.ReactElement => {
  const theme = useTheme()
  const router = ExpoRouter.useRouter()

  const { route } = props
  const goBack = React.useCallback(() => {
    router.navigate(route)
  }, [router, route])

  return (
    <ReactNative.Pressable
      hitSlop={50}
      testID={`${props.title} Back Button`}
      onPress={goBack}
      style={{ flexDirection: "row", alignItems: "flex-end" }}
    >
      {ReactNative.Platform.OS === "ios" ? (
        <IOSBackButton title={props.title} />
      ) : (
        <ExpoVectorIcons.MaterialCommunityIcons
          name="arrow-left"
          size={24}
          color={theme.colors.text}
          style={leftNavigationBarButtonStyle}
        />
      )}
    </ReactNative.Pressable>
  )
}

export default BackButtonWithTestId
