import React from "react"
import * as ReactNative from "react-native"
import * as Animatable from "react-native-animatable"
import Dialog from "react-native-dialog"
import type { Player } from "types/Player"
import Config from "Config"
import useApiToken from "hooks/useApiToken"
import useUserId from "hooks/useUserId"
import useIsSignedIn from "hooks/useIsSignedIn"
import useNavigationHeaderToastNotification from "hooks/useNavigationHeaderToastNotification"
import VerticalSpacing from "./VerticalSpacing"

const completeConfirmationCodeLength = 6

interface PlayerAuthenticationFlowProps {
  player: Player
}

const PlayerAuthenticationFlow = ({
  player,
}: PlayerAuthenticationFlowProps): React.ReactElement => {
  const { showNotification } = useNavigationHeaderToastNotification()

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
        dismissAfter: 7,
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

  // TODO: Need a web version of Dialog; it uses RN.PlatformColor so it does not work on web
  return (
    <>
      {!isSignedIn && (
        <>
          <VerticalSpacing />
          <ReactNative.Button
            testID="This is Me Button"
            title="👋 This is Me"
            onPress={sendTextMessageConfirmationCode}
          />
        </>
      )}
      {ReactNative.Platform.OS !== "web" && (
        <Dialog.Container visible={confirmationCodeInputIsVisible}>
          <Dialog.Title>Texted You 😘</Dialog.Title>
          <Animatable.View
            ref={
              viewRefThatAnimatesTheConfirmationCodeInputPopupWhenIncorrectCodesAreEntered
            }
          >
            <Dialog.Input
              autoFocus
              value={confirmationCode}
              onChangeText={setConfirmationCode}
              keyboardType="number-pad"
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
            disabled={
              confirmationCode.length !== completeConfirmationCodeLength
            }
          />
        </Dialog.Container>
      )}
    </>
  )
}

export default PlayerAuthenticationFlow
