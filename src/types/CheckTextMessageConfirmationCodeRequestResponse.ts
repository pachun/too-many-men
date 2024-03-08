export type CheckTextMessageConfirmationCodeRequestResponse =
  | { status: "correct"; apiToken: string }
  | { status: "incorrect" }
