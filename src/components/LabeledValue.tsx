import useTheme from "hooks/useTheme"
import * as ReactNative from "react-native"

interface LabeledValueProps {
  label: string
  value: string
}

const LabeledValue = ({
  label,
  value,
}: LabeledValueProps): React.ReactElement => {
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
            "secondarySystemBackground",
          ),
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <ReactNative.Text style={{ color: theme.colors.text, fontSize: 20 }}>
          {label}
        </ReactNative.Text>
        <ReactNative.Text
          style={{
            color: theme.colors.text,
            fontSize: 20,
            fontWeight: "bold",
          }}
        >
          {value}
        </ReactNative.Text>
      </ReactNative.View>
    </ReactNative.View>
  )
}

export default LabeledValue
