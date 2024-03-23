import useTheme from "hooks/useTheme"
import React from "react"
import * as ReactNative from "react-native"

interface RadioButtonProps {
  color: "green" | "red" | "yellow"
  label: string
  selected: boolean
  onPress: () => void
}

const RadioButton = ({
  color,
  label,
  selected,
  onPress,
}: RadioButtonProps): React.ReactElement => {
  const theme = useTheme()

  const buttonColor = React.useMemo(() => {
    if (ReactNative.Platform.OS === "ios") {
      return ReactNative.PlatformColor(
        `system${color[0].toUpperCase() + color.slice(1)}`,
      )
    }
  }, [color])

  return (
    <ReactNative.Pressable
      style={{
        borderColor: buttonColor,
        ...(selected ? { backgroundColor: buttonColor } : {}),
        borderWidth: 1,
        borderRadius: 3,
        width: 100,
        justifyContent: "center",
      }}
      onPress={onPress}
    >
      <ReactNative.Text
        style={{
          ...(selected
            ? { color: theme.colors.background, fontWeight: "bold" }
            : { color: buttonColor }),
          fontSize: 20,
          textAlign: "center",
          paddingLeft: 4,
          paddingRight: 4,
          paddingTop: 8,
          paddingBottom: 8,
        }}
      >
        {label}
      </ReactNative.Text>
    </ReactNative.Pressable>
  )
}

export default RadioButton
