import React from "react"
import useTheme, { color } from "hooks/useTheme"
import * as ReactNative from "react-native"
import RadioButton from "./RadioButton"

interface AreYouGoingToThisGameProps {
  onChange: (yesNoOrMaybe: "Yes" | "No" | "Maybe") => void
  value: "Yes" | "No" | "Maybe" | undefined
}

const AreYouGoingToThisGame = ({
  onChange,
  value,
}: AreYouGoingToThisGameProps): React.ReactElement => {
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
        <ReactNative.Text
          style={{ color: theme.colors.text, fontSize: 20, fontWeight: "bold" }}
        >
          Are you going to this game?
        </ReactNative.Text>
        <ReactNative.View style={{ height: 20 }} />
        <ReactNative.View
          style={{ flexDirection: "row", justifyContent: "space-between" }}
        >
          <RadioButton
            color={color({ ios: "systemGreen", other: "green" })}
            label="Yes"
            selected={value === "Yes"}
            onPress={() => onChange("Yes")}
          />
          <RadioButton
            color={color({ ios: "systemRed", other: "red" })}
            label="No"
            selected={value === "No"}
            onPress={() => onChange("No")}
          />
          <RadioButton
            color={color({ ios: "systemYellow", other: "yellow" })}
            label="Maybe"
            selected={value === "Maybe"}
            onPress={() => onChange("Maybe")}
          />
        </ReactNative.View>
      </ReactNative.View>
    </ReactNative.View>
  )
}

export default AreYouGoingToThisGame
