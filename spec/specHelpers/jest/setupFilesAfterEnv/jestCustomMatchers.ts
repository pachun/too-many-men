// more about setting up jest custom matchers:
// https://github.com/testing-library/react-testing-library/issues/36#issuecomment-440442300

import type { RenderResult } from "@testing-library/react-native"
import type { ComponentType } from "react"

expect.extend({
  toShowText: (component: RenderResult, text: string) => {
    const pass = component.queryAllByText(text).length !== 0
    return {
      pass,
      message: (): string =>
        pass
          ? `expected "${text}" not to be shown`
          : `expected "${text}" to be shown`,
    }
  },
  toShowTestId: (component: RenderResult, testID: string) => {
    const pass = component.queryByTestId(testID) !== null
    return {
      pass,
      message: (): string =>
        pass
          ? `expected test id "${testID}" not to be shown`
          : `expected test id "${testID}" to be shown`,
    }
  },
  toHaveNavigationBarTitle: (
    component: RenderResult,
    {
      title,
      nestedNavigationBarIndex,
    }: { title: string; nestedNavigationBarIndex?: number },
  ) => {
    const shallowestNestedNavigationBarIndex = 0
    const navigationBarIndex =
      nestedNavigationBarIndex === undefined
        ? shallowestNestedNavigationBarIndex
        : nestedNavigationBarIndex
    const allNavigationBars = component.UNSAFE_getAllByType(
      "RNSScreenStackHeaderConfig" as unknown as ComponentType<unknown>,
    )
    const allNavigationBarTitles = allNavigationBars.map(
      navigationBar => navigationBar.props.title,
    )
    const actualTitle = allNavigationBars.at(navigationBarIndex).props.title
    const pass = actualTitle === title

    return {
      pass,
      message: (): string =>
        pass
          ? `expected "${title}" not to be the navigation bar title at index ${navigationBarIndex} (nav bar titles: ${JSON.stringify(allNavigationBarTitles)})`
          : `expected "${title}" to be the navigation bar title at index ${navigationBarIndex} but got "${actualTitle}" (nav bar titles: ${JSON.stringify(allNavigationBarTitles)})`,
    }
  },
})
