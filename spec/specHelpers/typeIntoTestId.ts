import * as ERTL from "expo-router/testing-library"

const typeIntoTestId = (testId: string, text: string): void => {
  ERTL.userEvent.setup().type(ERTL.screen.getByTestId(testId), text)
}

export default typeIntoTestId
