import AppText from "components/AppText"
import ForegroundItem from "components/ForegroundItem"

interface LabeledValueProps {
  label: string
  value: string
}

const LabeledValue = ({
  label,
  value,
}: LabeledValueProps): React.ReactElement => {
  return (
    <ForegroundItem
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <AppText>{label}</AppText>
      <AppText bold>{value}</AppText>
    </ForegroundItem>
  )
}

export default LabeledValue
