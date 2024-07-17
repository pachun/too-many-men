import React from "react"
import * as ReactNative from "react-native"
import * as ExpoVectorIcons from "@expo/vector-icons"
import useTheme from "hooks/useTheme"
import leftNavigationBarButtonStyle from "helpers/leftNavigationBarButtonStyle"

const SignOutButton = (props: { onPress: () => void }): React.ReactElement => {
  const theme = useTheme()

  return (
    <ReactNative.Pressable
      testID="Signout Button"
      hitSlop={50}
      onPress={props.onPress}
    >
      <ExpoVectorIcons.SimpleLineIcons
        name="logout"
        size={25}
        color={theme.colors.primary}
        style={leftNavigationBarButtonStyle}
      />
    </ReactNative.Pressable>
  )
}

export default SignOutButton
