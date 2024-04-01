/* c8 ignore start */
import useTheme from "hooks/useTheme"
import * as ReactNative from "react-native"
import AppText from "components/AppText"
import VerticalSpacing from "components/VerticalSpacing"

interface WebPromptProps {
  value: string
  onChange: (value: string) => void
  isVisible: boolean
  onCancel: () => void
  onSubmit: () => void
}

const WebPrompt = ({
  value,
  onChange,
  isVisible,
  onCancel,
  onSubmit,
}: WebPromptProps): React.ReactElement => {
  const theme = useTheme()

  if (ReactNative.Platform.OS === "web" && isVisible) {
    return (
      <ReactNative.View
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          top: 0,
          left: 0,
          backgroundColor: theme.colors.background,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ReactNative.View
          style={{
            padding: theme.foregroundItemVerticalPadding,
            backgroundColor: theme.colors.foregroundItemBackgroundColor,
            borderRadius: 10,
          }}
        >
          <AppText>Texted You 😘</AppText>
          <VerticalSpacing />
          <ReactNative.TextInput
            style={{
              width: 300,
              fontSize: theme.fontSize,
              padding: 10,
              borderRadius: 2,
              color: theme.colors.text,
              backgroundColor: theme.colors.background,
            }}
            value={value}
            onChangeText={onChange}
          />
          <VerticalSpacing />
          <ReactNative.View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <ReactNative.Pressable
              onPress={onSubmit}
              style={{
                borderWidth: 1,
                borderRadius: 2,
                borderColor: theme.colors.text,
                padding: 5,
                width: 100,
              }}
            >
              <AppText style={{ textAlign: "center" }}>Confirm</AppText>
            </ReactNative.Pressable>
            <ReactNative.Pressable
              onPress={onCancel}
              style={{
                borderWidth: 1,
                borderRadius: 2,
                borderColor: theme.colors.text,
                padding: 5,
                width: 100,
              }}
            >
              <AppText style={{ textAlign: "center" }}>Cancel</AppText>
            </ReactNative.Pressable>
          </ReactNative.View>
        </ReactNative.View>
      </ReactNative.View>
    )
  } else {
    return <></>
  }
}

export default WebPrompt
/* c8 ignore end */
