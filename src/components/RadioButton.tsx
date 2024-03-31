import React from "react"
import * as ReactNative from "react-native"
import * as Animatable from "react-native-animatable"
import * as Haptics from "expo-haptics"
import useTheme from "hooks/useTheme"

interface RadioButtonProps {
  color: string
  label: string
  disabled: boolean
  selected: boolean
  onPress: () => void
}

const RadioButton = ({
  color,
  label,
  disabled,
  selected,
  onPress: onPressFromParentComponent,
}: RadioButtonProps): React.ReactElement => {
  const theme = useTheme()

  const buttonRef = React.useRef<Animatable.View>(null)

  const onPress = (): void => {
    if (!disabled) {
      onPressFromParentComponent()
      if (buttonRef.current) {
        // @ts-ignore
        buttonRef.current.pulse(100)
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
      }
    }
  }

  return (
    <ReactNative.Pressable onPress={onPress} hitSlop={20} testID={label}>
      <Animatable.View
        ref={buttonRef}
        style={{
          borderColor: color,
          ...(selected ? { backgroundColor: color } : {}),
          borderWidth: 1,
          borderRadius: 3,
          width: 100,
          justifyContent: "center",
        }}
        testID={`${label} Radio Button`}
      >
        <ReactNative.Text
          style={{
            ...(selected
              ? { color: theme.colors.background, fontWeight: "bold" }
              : { color: color }),
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
