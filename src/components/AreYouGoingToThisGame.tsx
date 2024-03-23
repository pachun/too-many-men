import React from "react"
import useTheme from "hooks/useTheme"
import * as ReactNative from "react-native"
import RadioButton from "./RadioButton"

interface AreYouGoingToThisGameProps {
  onChange: (yesNoOrMaybe: string) => void
}

const AreYouGoingToThisGame = ({
  onChange,
}: AreYouGoingToThisGameProps): React.ReactElement => {
  const theme = useTheme()

  const [selected, setSelected] = React.useState<
    "Yes" | "No" | "Maybe" | undefined
  >()

  const onSelection = React.useCallback(
    (selection: "Yes" | "No" | "Maybe") => () => {
      setSelected(selection)
      onChange(selection)
    },
    [onChange],
  )

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
          Are you going to this game?
        </ReactNative.Text>
        <ReactNative.View style={{ height: 20 }} />
        <ReactNative.View
          style={{ flexDirection: "row", justifyContent: "space-between" }}
        >
          <RadioButton
            color="green"
            label="Yes"
            selected={selected === "Yes"}
            onPress={onSelection("Yes")}
          />
          <RadioButton
            color="red"
            label="No"
            selected={selected === "No"}
            onPress={onSelection("No")}
          />
          <RadioButton
            color="yellow"
            label="Maybe"
            selected={selected === "Maybe"}
            onPress={onSelection("Maybe")}
          />
        </ReactNative.View>
      </ReactNative.View>
    </ReactNative.View>
  )
}

export default AreYouGoingToThisGame
