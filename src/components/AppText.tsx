import useTheme from "hooks/useTheme"
import * as ReactNative from "react-native"

interface AppTextProps {
  children: string
  bold?: boolean
  style?: ReactNative.StyleProp<ReactNative.TextStyle>
}

const AppText = ({
  children,
  bold = false,
  style = {},
}: AppTextProps): React.ReactElement => {
  const theme = useTheme()

  return (
    <ReactNative.Text
      style={[
        {
          fontSize: theme.fontSize,
          color: theme.colors.text,
          fontWeight: bold ? "bold" : "normal",
        },
        style,
      ]}
    >
      {children}
    </ReactNative.Text>
  )
}

export default AppText
