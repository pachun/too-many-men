import React from "react"
import Dialog from "react-native-dialog"
import * as ExpoRouter from "expo-router"
import * as Animatable from "react-native-animatable"
import Config from "Config"
import useUserId from "hooks/useUserId"
import useApiToken from "hooks/useApiToken"
import useNavigationHeaderToastNotification from "hooks/useNavigationHeaderToastNotification"

export type CheckTextMessageConfirmationCodeRequestResponse =
  | { correct_confirmation_code: true; api_token: string; player_id: number }
  | { correct_confirmation_code: false; confirmation_code_was_unset: boolean }

interface ConfirmationCodeInputPopupProps {
  phoneNumber: string
  confirmationCode: string
  setConfirmationCode: (confirmationCode: string) => void
  isVisible: boolean
  onDismiss: () => void
}

const ConfirmationCodeInputPopup = ({
  phoneNumber,
  confirmationCode,
  setConfirmationCode,
  isVisible,
  onDismiss,
}: ConfirmationCodeInputPopupProps): React.ReactElement => {
  const viewRefThatAnimatesTheConfirmationCodeInputWhenIncorrectCodesAreEntered =
    React.useRef<Animatable.View>(null)

  const { setUserId } = useUserId()
  const { setApiToken } = useApiToken()

  const router = ExpoRouter.useRouter()

  const { showNotification } = useNavigationHeaderToastNotification()

  const shakeConfirmationCodeInputField = (): void => {
    if (
      viewRefThatAnimatesTheConfirmationCodeInputWhenIncorrectCodesAreEntered.current
    ) {
      // @ts-ignore
      viewRefThatAnimatesTheConfirmationCodeInputWhenIncorrectCodesAreEntered.current.shake(
        300,
      )
    }
  }

  const checkTextMessageConfirmationCode = React.useCallback(async () => {
    try {
      const response = await fetch(
        `${Config.apiUrl}/text_message_confirmation_codes/check`,
        {
          method: "POST",
          headers: { "Content-Type": "Application/JSON" },
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
        await setApiToken(apiToken)
        await setUserId(userId)
        router.navigate("/teams")
      } else if (
        !responseJson.correct_confirmation_code &&
        !responseJson.confirmation_code_was_unset
      ) {
        setConfirmationCode("")
        shakeConfirmationCodeInputField()
      } else {
        onDismiss()
      }
    } catch {
      showNotification({
        type: "warning",
        message: "Trouble Connecting to the Internet",
        dismissAfter: 3,
      })
    }
  }, [
    phoneNumber,
    confirmationCode,
    setConfirmationCode,
    router,
    setApiToken,
    setUserId,
    showNotification,
    onDismiss,
  ])

  return isVisible ? (
    <Dialog.Container visible={true}>
      <Dialog.Title style={{ fontWeight: "bold" }}>
        We texted you a code
      </Dialog.Title>
      <Dialog.Description>Enter it here</Dialog.Description>
      <Animatable.View
        ref={
          viewRefThatAnimatesTheConfirmationCodeInputWhenIncorrectCodesAreEntered
        }
      >
        <Dialog.Input
          autoFocus
          value={confirmationCode}
          onChangeText={setConfirmationCode}
          style={{ fontSize: 20 }}
          textAlign="center"
          keyboardType="number-pad"
          testID="Confirmation Code Input"
        />
      </Animatable.View>
      <Dialog.Button label="Cancel" onPress={onDismiss} />
      <Dialog.Button
        label="Confirm"
        onPress={checkTextMessageConfirmationCode}
      />
    </Dialog.Container>
  ) : (
    <></>
  )
}

export default ConfirmationCodeInputPopup
