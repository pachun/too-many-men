import useTheme from "hooks/useTheme"
import * as ReactNative from "react-native"
import RadioButton from "./RadioButton"

const AreYouGoingToThisGame = (): React.ReactElement => {
  const theme = useTheme()

  return (
    <ReactNative.View style={{ width: "100%", alignItems: "center" }}>
      <ReactNative.View
        style={{
          width: "96%",
          paddingLeft: 10,
          paddingRight: 10,
          paddingTop: 20,
          paddingBottom: 20,
          borderRadius: 5,
          backgroundColor: ReactNative.PlatformColor(
            "tertiarySystemBackground",
          ),
        }}
      >
        <ReactNative.Text style={{ color: theme.colors.text, fontSize: 20 }}>
          Are You Going To This Game?
        </ReactNative.Text>
        <ReactNative.View style={{ height: 10 }} />
        <RadioButton
          color="green"
          label="Yes"
          selected={false}
          onPress={() => {}}
        />
      </ReactNative.View>
    </ReactNative.View>
  )
}

export default AreYouGoingToThisGame
