import React from "react"
import * as ReactNative from "react-native"
import * as ExpoRouter from "expo-router"
import Dialog from "react-native-dialog"
import AsyncStorage from "@react-native-async-storage/async-storage"
import * as Animatable from "react-native-animatable"
import Config from "Config"
import type { Player as PlayerType } from "types/Player"
import formatPhoneNumber from "helpers/formatPhoneNumber"
import RefreshablePlayersContext from "components/PlayersProvider"
import useTheme from "hooks/useTheme"
import CenteredLoadingSpinner from "components/CenteredLoadingSpinner"

const completeConfirmationCodeLength = 6

const Player = (): React.ReactElement => {
  const { id: playerId } = ExpoRouter.useLocalSearchParams()

  const [player, setPlayer] = React.useState<PlayerType | undefined>()

  const { refreshablePlayers } = React.useContext(RefreshablePlayersContext)

  ExpoRouter.useFocusEffect(
    React.useCallback(() => {
      const getPlayer = async (): Promise<void> => {
        const getPlayerFromCache = (): PlayerType | undefined => {
          if (
            refreshablePlayers.status === "Success" ||
            refreshablePlayers.status === "Refreshing" ||
            refreshablePlayers.status === "Refresh Error"
          ) {
            return refreshablePlayers.data.find(
              refreshablePlayer => refreshablePlayer.id === Number(playerId),
            )
          }
        }

        const getPlayerFromApi = async (): Promise<PlayerType> => {
          return await (
            await fetch(Config.apiUrl + `/players/${playerId}`)
          ).json()
        }

        const cachedPlayer = getPlayerFromCache()

        setPlayer(cachedPlayer ? cachedPlayer : await getPlayerFromApi())
      }

      getPlayer()
    }, [playerId, refreshablePlayers]),
  )

  const theme = useTheme()

  const navigationBarTitleLabel = React.useMemo(
    () => `${player?.first_name} ${player?.last_name}`,
    [player],
  )

  const formattedPhoneNumberLabel = React.useMemo(() => {
    return player?.phone_number ? formatPhoneNumber(player.phone_number) : ""
  }, [player?.phone_number])

  const formattedJerseyNumberLabel = React.useMemo(() => {
    return player?.jersey_number ? `#${player.jersey_number}` : ""
  }, [player?.jersey_number])

  const [confirmationCodeInputIsVisible, setConfirmationCodeDialogIsVisible] =
    React.useState(false)

  const sendTextMessageConfirmationCode = async (): Promise<void> => {
    await fetch(
      `${Config.apiUrl}/players/${player!.id.toString()}/send_text_message_confirmation_code`,
    )
    setConfirmationCodeDialogIsVisible(true)
  }

  const [confirmationCode, setConfirmationCode] = React.useState("")

  const removeConfirmationCodeInputPopup = React.useCallback(() => {
    ReactNative.Keyboard.dismiss()
    setConfirmationCodeDialogIsVisible(false)
    setConfirmationCode("")
  }, [])

  const viewRefThatAnimatesTheConfirmationCodeInputPopupWhenIncorrectCodesAreEntered =
    React.useRef<Animatable.View>(null)

  const checkConfirmationCodeCorrectness = React.useCallback(async () => {
    if (player && confirmationCode.length === completeConfirmationCodeLength) {
      const response = await (
        await fetch(
          `${Config.apiUrl}/players/${player.id}/check_text_message_confirmation_code?confirmation_code=${confirmationCode}`,
          { method: "post" },
        )
      ).json()
      if (response.status === "correct") {
        await AsyncStorage.setItem("API Token", response.apiToken)
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
    }
  }, [confirmationCode, player, removeConfirmationCodeInputPopup])

  return player ? (
    <>
      <ExpoRouter.Stack.Screen options={{ title: navigationBarTitleLabel }} />
      <ReactNative.View
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ReactNative.Text
          style={{ color: theme.colors.text, fontSize: 24, fontWeight: "bold" }}
        >
          {formattedJerseyNumberLabel}
        </ReactNative.Text>
        <ReactNative.View style={{ height: 8 }} />
        <ReactNative.Text style={{ color: theme.colors.text }}>
          {formattedPhoneNumberLabel}
        </ReactNative.Text>
        <ReactNative.View style={{ height: 8 }} />
        <ReactNative.Button
          testID="This is Me Button"
          title="👋 This is Me"
          onPress={sendTextMessageConfirmationCode}
        />
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
            disabled={
              confirmationCode.length !== completeConfirmationCodeLength
            }
          />
        </Dialog.Container>
      </ReactNative.View>
    </>
  ) : (
    <>
      <ExpoRouter.Stack.Screen options={{ title: "" }} />
      <CenteredLoadingSpinner />
    </>
  )
}

export default Player
