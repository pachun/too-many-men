// more about setting up jest custom matchers:
// https://github.com/testing-library/react-testing-library/issues/36#issuecomment-440442300

import type { RenderResult } from "@testing-library/react-native"

expect.extend({
  toShowText: (component: RenderResult, text: string) => {
    const pass = component.queryByText(text) !== null
    return {
      pass,
      message: (): string =>
        pass
          ? `expected "${text}" not to be shown`
          : `expected "${text}" to be shown`,
    }
  },
  toShowTestID: (component: RenderResult, testID: string) => {
    const pass = component.queryByTestId(testID) !== null
    return {
      pass,
      message: (): string =>
        pass
          ? `expected test id "${testID}" not to be shown`
          : `expected test id "${testID}" to be shown`,
    }
  },
})
