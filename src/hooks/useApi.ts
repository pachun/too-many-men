import React from "react"
import Config from "Config"
import useNavigationHeaderToastNotification from "hooks/useNavigationHeaderToastNotification"
import type { CheckTextMessageConfirmationCodeRequestResponse } from "types/CheckTextMessageConfirmationCodeRequestResponse"
import type { NotificationType } from "components/NavigationHeaderToastNotification"
import useApiToken from "hooks/useApiToken"
import { trackAptabaseEvent } from "helpers/aptabase"
import emptyFunction from "helpers/emptyFunctionForInitializingContexts"

const troubleConnectingToTheInternetNotification: NotificationType = {
  type: "warning",
  message: "Trouble Connecting to the Internet",
  dismissAfter: 3,
}

type CheckTextMessageConfirmationCodeArguments = {
  phoneNumber: string
  confirmationCode: string
  whenTheCodeIsCorrect: ({
    apiToken,
    userId,
  }: {
    apiToken: string
    userId: number
  }) => Promise<void>
  whenTheCodeIsIncorrectTheFirstOrSecondTime: () => Promise<void>
  whenTheCodeIsIncorrectTheThirdTime: () => Promise<void>
}

type SendTextMessageConfirmationCodeArguments = { phoneNumber: string }

type GetResourcesArguments<Resources> = {
  resourceApiPath: string
  onSuccess: (resources: Resources) => void
  onFailure?: () => void
}

interface useApiReturnType {
  sendTextMessageConfirmationCode: (
    args: SendTextMessageConfirmationCodeArguments,
  ) => Promise<void>
  checkTextMessageConfirmationCode: (
    args: CheckTextMessageConfirmationCodeArguments,
  ) => Promise<void>
  getResource: <Resources>(
    args: GetResourcesArguments<Resources>,
  ) => Promise<void>
}

const useApi = (): useApiReturnType => {
  const { apiToken } = useApiToken()
  const { showNotification } = useNavigationHeaderToastNotification()

  const headers = React.useMemo(
    () => ({
      "Content-Type": "Application/JSON",
      ...(apiToken !== null ? { ApiToken: apiToken } : {}),
    }),
    [apiToken],
  )

  const getResource = React.useCallback(
    async <Resource>({
      resourceApiPath,
      onSuccess,
      onFailure = emptyFunction,
    }: GetResourcesArguments<Resource>): Promise<void> => {
      if (apiToken) {
        try {
          const response = await fetch(`${Config.apiUrl}${resourceApiPath}`, {
            headers,
          })
          const resources = (await response.json()) as Resource
          onSuccess(resources)
          trackAptabaseEvent(`Loaded ${resourceApiPath}`)
        } catch {
          trackAptabaseEvent(`Failed to load ${resourceApiPath}`)
          showNotification(troubleConnectingToTheInternetNotification)
          onFailure()
        }
      }
    },
    [headers, showNotification, apiToken],
  )

  const sendTextMessageConfirmationCode = React.useCallback(
    async ({
      phoneNumber,
    }: SendTextMessageConfirmationCodeArguments): Promise<void> => {
      try {
        await fetch(
          `${Config.apiUrl}/text_message_confirmation_codes/deliver`,
          {
            method: "POST",
            headers,
            body: JSON.stringify({ phone_number: phoneNumber }),
          },
        )
      } catch {
        showNotification(troubleConnectingToTheInternetNotification)
      }
    },
    [showNotification, headers],
  )

  const checkTextMessageConfirmationCode = React.useCallback(
    async ({
      phoneNumber,
      confirmationCode,
      whenTheCodeIsCorrect,
      whenTheCodeIsIncorrectTheFirstOrSecondTime,
      whenTheCodeIsIncorrectTheThirdTime,
    }: CheckTextMessageConfirmationCodeArguments) => {
      try {
        const response = await fetch(
          `${Config.apiUrl}/text_message_confirmation_codes/check`,
          {
            method: "POST",
            headers,
            body: JSON.stringify({
              phone_number: phoneNumber,
              confirmation_code: confirmationCode,
            }),
          },
        )
        const responseJson =
          (await response.json()) as CheckTextMessageConfirmationCodeRequestResponse
        if (responseJson.correct_confirmation_code) {
          const apiToken = responseJson.api_token
          const userId = responseJson.player_id
          await whenTheCodeIsCorrect({ apiToken, userId })
        } else {
          const isFirstOrSecondIncorrectCode =
            !responseJson.correct_confirmation_code &&
            !responseJson.confirmation_code_was_unset
          if (isFirstOrSecondIncorrectCode) {
            await whenTheCodeIsIncorrectTheFirstOrSecondTime()
          } else {
            await whenTheCodeIsIncorrectTheThirdTime()
          }
        }
      } catch {
        showNotification(troubleConnectingToTheInternetNotification)
      }
    },
    [headers, showNotification],
  )

  return {
    sendTextMessageConfirmationCode,
    checkTextMessageConfirmationCode,
    getResource,
  }
}

export default useApi
