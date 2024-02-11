import * as ERTL from "expo-router/testing-library"

const pullToRefresh = async (testID: string): Promise<void> =>
  await ERTL.act(() =>
    ERTL.screen.getByTestId(testID).props.refreshControl.props.onRefresh(),
  )

export default pullToRefresh
