import React from "react"
import * as ReactNative from "react-native"
import * as Animatable from "react-native-animatable"
import * as Haptics from "expo-haptics"
import useTheme from "hooks/useTheme"

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
  onPress: onPressFromParentComponent,
}: RadioButtonProps): React.ReactElement => {
  const theme = useTheme()

  const buttonColor = React.useMemo(() => {
    if (ReactNative.Platform.OS === "ios") {
      return ReactNative.PlatformColor(
        `system${color[0].toUpperCase() + color.slice(1)}`,
      )
    }
  }, [color])

  const buttonRef = React.useRef<Animatable.View>(null)

  const onPress = (): void => {
    onPressFromParentComponent()
    if (buttonRef.current) {
      // @ts-ignore
      buttonRef.current.pulse(100)
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    }
  }

  return (
    <ReactNative.Pressable onPress={onPress} hitSlop={20}>
      <Animatable.View
        ref={buttonRef}
        style={{
          borderColor: buttonColor,
          ...(selected ? { backgroundColor: buttonColor } : {}),
          borderWidth: 1,
          borderRadius: 3,
          width: 100,
          justifyContent: "center",
        }}
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
      </Animatable.View>
    </ReactNative.Pressable>
  )
}

export default RadioButton
