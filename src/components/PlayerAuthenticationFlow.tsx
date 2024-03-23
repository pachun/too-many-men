import React from "react"
import * as ReactNative from "react-native"
import * as Animatable from "react-native-animatable"
import Dialog from "react-native-dialog"
import NavigationHeaderToastNotification from "./NavigationHeaderToastNotification"
import type { Player } from "types/Player"
import Config from "Config"
import useApiToken from "hooks/useApiToken"
import useUserId from "hooks/useUserId"
import useIsSignedIn from "hooks/useIsSignedIn"

const completeConfirmationCodeLength = 6

interface PlayerAuthenticationFlowProps {
  player: Player
}

const PlayerAuthenticationFlow = ({
  player,
}: PlayerAuthenticationFlowProps): React.ReactElement => {
  const { showNotification } = React.useContext(
    NavigationHeaderToastNotification.Context,
  )

  const [confirmationCodeInputIsVisible, setConfirmationCodeDialogIsVisible] =
    React.useState(false)

  const sendTextMessageConfirmationCode = async (): Promise<void> => {
    setConfirmationCodeDialogIsVisible(true)
    await fetch(
      `${Config.apiUrl}/players/${player.id.toString()}/send_text_message_confirmation_code`,
    )
  }

  const { setApiToken } = useApiToken()
  const { setUserId } = useUserId()

  const isSignedIn = useIsSignedIn()

  const viewRefThatAnimatesTheConfirmationCodeInputPopupWhenIncorrectCodesAreEntered =
    React.useRef<Animatable.View>(null)

  const [confirmationCode, setConfirmationCode] = React.useState("")

  const removeConfirmationCodeInputPopup = React.useCallback(() => {
    ReactNative.Keyboard.dismiss()
    setConfirmationCodeDialogIsVisible(false)
    setConfirmationCode("")
  }, [])

  const checkConfirmationCodeCorrectness = React.useCallback(async () => {
    const response = await (
      await fetch(
        `${Config.apiUrl}/players/${player.id}/check_text_message_confirmation_code?confirmation_code=${confirmationCode}`,
        { method: "post" },
      )
    ).json()
    if (response.status === "correct") {
      await setApiToken(response.api_token)
      await setUserId(player.id)
      showNotification({
        type: "success",
        message: `Hey ${player.first_name}! You're signed in.`,
        dismissAfter: 3,
      })
      removeConfirmationCodeInputPopup()
    } else {
      if (
        viewRefThatAnimatesTheConfirmationCodeInputPopupWhenIncorrectCodesAreEntered.current
      ) {
        // @ts-ignore https://github.com/oblador/react-native-animatable/issues/313#issuecomment-951038397
        viewRefThatAnimatesTheConfirmationCodeInputPopupWhenIncorrectCodesAreEntered.current.shake(
          300,
        )
      }
      setConfirmationCode("")
    }
  }, [
    confirmationCode,
    player,
    removeConfirmationCodeInputPopup,
    showNotification,
    setApiToken,
    setUserId,
  ])

  return (
    <>
      {!isSignedIn && (
        <ReactNative.Button
          testID="This is Me Button"
          title="👋 This is Me"
          onPress={sendTextMessageConfirmationCode}
        />
      )}
      <Dialog.Container visible={confirmationCodeInputIsVisible}>
        <Dialog.Title>Texted You 😘</Dialog.Title>
        <Animatable.View
          ref={
            viewRefThatAnimatesTheConfirmationCodeInputPopupWhenIncorrectCodesAreEntered
          }
        >
          <Dialog.CodeInput
            autoFocus
            codeLength={completeConfirmationCodeLength}
            value={confirmationCode}
            onChangeText={setConfirmationCode}
            testID="Confirmation Code Input"
          />
        </Animatable.View>
        <Dialog.Button
          label="Cancel"
          onPress={removeConfirmationCodeInputPopup}
        />
        <Dialog.Button
          testID="OK Button"
          label="OK"
          onPress={checkConfirmationCodeCorrectness}
          disabled={confirmationCode.length !== completeConfirmationCodeLength}
        />
      </Dialog.Container>
    </>
  )
}

export default PlayerAuthenticationFlow
