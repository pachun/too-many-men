export type CheckTextMessageConfirmationCodeRequestResponse =
  | { correct_confirmation_code: true; api_token: string; player_id: number }
  | { correct_confirmation_code: false; confirmation_code_was_unset: boolean }
