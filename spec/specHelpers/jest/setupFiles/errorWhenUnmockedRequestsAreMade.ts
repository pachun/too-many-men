import nock from "nock"

const breakTestOnFailureWithMessage = (message: string): void => {
  it(`\n\n\nTHIS TEST NOT BREAKING BECAUSE YOU NESTED TESTS. IT FAILED BECAUSE:\n\n${message}\n\n\n`, () => {})
}

nock.emitter.on("no match", req => {
  breakTestOnFailureWithMessage(
    `an unmocked request was made:\n` +
      `${JSON.stringify(req.options, null, 2)}\n` +
      `\n` +
      `nock is only set up to mock:\n` +
      `${JSON.stringify(nock.pendingMocks())}`,
  )
})
