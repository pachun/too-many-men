import React from "react"
import * as ReactNative from "react-native"
import * as ExpoRouter from "expo-router"
import ForegroundItem from "components/ForegroundItem"
import useTheme from "hooks/useTheme"
import PhoneNumberField from "components/PhoneNumberField"
import useCurrentTeam from "hooks/useCurrentTeam"
import AppText from "components/AppText"
import useRefreshablePlayers from "hooks/useRefreshablePlayers"
import VerticalSpacing from "components/VerticalSpacing"
import useApi from "hooks/useApi"
import type { Player } from "types/Player"
import AboveKeyboardButton from "components/AboveKeyboardButton"
import useNavigationHeaderToastNotification from "hooks/useNavigationHeaderToastNotification"
import CenteredLoadingSpinner from "components/CenteredLoadingSpinner"

const NewPlayer = (): React.ReactElement => {
  const theme = useTheme()
  const router = ExpoRouter.useRouter()
  const team = useCurrentTeam()
  const { createResource } = useApi()
  const { refreshablePlayers } = useRefreshablePlayers()

  const [firstName, setFirstName] = React.useState("")
  const [lastName, setLastName] = React.useState("")
  const [phoneNumber, setPhoneNumber] = React.useState("")

  const firstNameFieldRef = React.useRef<ReactNative.TextInput>(null)
  const lastNameFieldRef = React.useRef<ReactNative.TextInput>(null)
  const phoneNumberFieldRef = React.useRef<ReactNative.TextInput>(null)

  /* c8 ignore start */
  // React native doesn't have support for testing field focus
  const focusFirstNameField = (): void => firstNameFieldRef.current?.focus()
  const focusLastNameField = (): void => lastNameFieldRef.current?.focus()
  const focusPhoneNumberField = (): void => phoneNumberFieldRef.current?.focus()
  /* c8 ignore end */

  const existingTeammateUsingPhoneNumber = React.useMemo(():
    | Player
    | "None" => {
    if (
      refreshablePlayers.type === "Without Data" ||
      phoneNumber.length !== 10
    ) {
      return "None"
    } else {
      return (
        refreshablePlayers?.data.find(
          teammate => teammate.phone_number === phoneNumber,
        ) || "None"
      )
    }
  }, [refreshablePlayers, phoneNumber])

  const existingTeammateUsingPhoneNumberMessage = React.useMemo(():
    | string
    | undefined => {
    if (existingTeammateUsingPhoneNumber !== "None") {
      const { first_name, last_name } = existingTeammateUsingPhoneNumber
      return `${first_name} ${last_name} has that phone number and is already on ${team?.name}.`
    }
  }, [existingTeammateUsingPhoneNumber, team])

  const isShowingSendInviteButton = React.useMemo(() => {
    const hasFirstName = firstName.length >= 2
    const hasLastName = lastName.length >= 2
    const hasPhoneNumber = phoneNumber.length === 10
    const canSendInvite =
      hasFirstName &&
      hasLastName &&
      hasPhoneNumber &&
      existingTeammateUsingPhoneNumber === "None"
    return canSendInvite
  }, [firstName, lastName, phoneNumber, existingTeammateUsingPhoneNumber])

  const { showNotification } = useNavigationHeaderToastNotification()

  const invitePlayer = React.useCallback(async () => {
    if (team) {
      createResource({
        resource: {
          first_name: firstName,
          last_name: lastName,
          phone_number: phoneNumber,
        },
        resourceApiPath: `/teams/${team.id}/players`,
        onSuccess: () => {
          router.navigate(`/teams/${team?.id}/players`)
          showNotification({
            type: "success",
            message: `${firstName} was invited to ${team?.name}`,
            dismissAfter: 3,
          })
        },
        onFailure: () => {},
      })
    }
  }, [
    team,
    firstName,
    lastName,
    phoneNumber,
    createResource,
    router,
    showNotification,
  ])

  if (!team) {
    return (
      <ReactNative.View style={{ flex: 1 }}>
        <CenteredLoadingSpinner />
      </ReactNative.View>
    )
  }

  return (
    <ReactNative.View style={{ flex: 1 }}>
      <ExpoRouter.Stack.Screen
        options={{
          title: team ? `${team.name} Invite` : "Invite",
          headerLeft: () => (
            <ReactNative.Pressable
              hitSlop={50}
              onPress={() => router.navigate(`/teams/${team!.id}`)}
            >
              <ReactNative.Text
                style={{
                  color: theme.colors.primary,
                  fontSize: theme.fontSize,
                }}
              >
                Cancel
              </ReactNative.Text>
            </ReactNative.Pressable>
          ),
        }}
      />
      <ReactNative.Pressable onPress={focusFirstNameField}>
        <ForegroundItem>
          <ReactNative.TextInput
            ref={firstNameFieldRef}
            value={firstName}
            onChangeText={setFirstName}
            autoFocus
            testID="First Name Field"
            placeholder="First Name"
            autoCorrect={false}
            spellCheck={false}
            enterKeyHint="next"
            onSubmitEditing={focusLastNameField}
            style={{
              color: theme.colors.text,
              fontSize: theme.fontSize,
              fontWeight: "bold",
            }}
          />
        </ForegroundItem>
      </ReactNative.Pressable>
      <ReactNative.Pressable onPress={focusLastNameField}>
        <ForegroundItem>
          <ReactNative.TextInput
            ref={lastNameFieldRef}
            value={lastName}
            onChangeText={setLastName}
            testID="Last Name Field"
            placeholder="Last Name"
            autoCorrect={false}
            spellCheck={false}
            enterKeyHint="next"
            onSubmitEditing={focusPhoneNumberField}
            style={{
              color: theme.colors.text,
              fontSize: theme.fontSize,
              fontWeight: "bold",
            }}
          />
        </ForegroundItem>
      </ReactNative.Pressable>
      <ReactNative.Pressable onPress={focusPhoneNumberField}>
        <ForegroundItem>
          <PhoneNumberField
            ref={phoneNumberFieldRef}
            phoneNumber={phoneNumber}
            onChangePhoneNumber={setPhoneNumber}
            testID="Phone Number Field"
            placeholder="Phone Number"
            style={{
              color: theme.colors.text,
              fontSize: theme.fontSize,
              fontWeight: "bold",
            }}
          />
        </ForegroundItem>
      </ReactNative.Pressable>
      {existingTeammateUsingPhoneNumberMessage && (
        <ReactNative.View style={{ alignItems: "center" }}>
          <VerticalSpacing />
          <AppText
            style={{
              width: theme.foregroundItemWidth,
              textAlign: "center",
              color: "red",
            }}
          >
            {existingTeammateUsingPhoneNumberMessage}
          </AppText>
        </ReactNative.View>
      )}
      {isShowingSendInviteButton && (
        <AboveKeyboardButton
          title="Send"
          testID="Send Invite Button"
          onPress={invitePlayer}
        />
      )}
    </ReactNative.View>
  )
}

export default NewPlayer
