// more about setting up jest custom matchers:
// https://github.com/testing-library/react-testing-library/issues/36#issuecomment-440442300

declare namespace jest {
  interface Matchers<_R> {
    toShowText(text: string): CustomMatcherResult
    toShowTestID(text: string): CustomMatcherResult
  }
}

// if this can be removed without breaking `yarn tsc` you can get rid of it
declare module "expect/build/matchers"
