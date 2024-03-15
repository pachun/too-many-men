export type CheckTextMessageConfirmationCodeRequestResponse =
  | { status: "correct"; api_token: string }
  | { status: "incorrect" }
