import AsyncStorage from "@react-native-async-storage/async-storage"
import * as ERTL from "expo-router/testing-library"
import { mockRequest } from "spec/specHelpers/mockApi"

const typeIntoTestId = (testId: string, text: string): void => {
  ERTL.userEvent.setup().type(ERTL.screen.getByTestId(testId), text)
}

describe("opening the app", () => {
  afterEach(async () => {
    await AsyncStorage.clear()
  })

  it("asks the player for their phone number", async () => {
    ERTL.renderRouter("src/app", { initialUrl: "/" })

    await ERTL.waitFor(() => {
      expect(ERTL.screen).toShowText("What's your phone number?")
    })
  })

  it("formats the phone number as the user types it in", async () => {
    ERTL.renderRouter("src/app", { initialUrl: "/" })

    typeIntoTestId("Phone Number Field", "012")

    await ERTL.waitFor(() => {
      expect(ERTL.screen).toShowText("012")
    })

    typeIntoTestId("Phone Number Field", "3")

    await ERTL.waitFor(() => {
      expect(ERTL.screen).toShowText("(012) 3")
    })

    typeIntoTestId("Phone Number Field", "456")

    await ERTL.waitFor(() => {
      expect(ERTL.screen).toShowText("(012) 345-6")
    })

    ERTL.userEvent
      .setup()
      .type(ERTL.screen.getByTestId("Phone Number Field"), "789")

    await ERTL.waitFor(() => {
      expect(ERTL.screen).toShowText("(012) 345-6789")
    })
  })

  it("prevents more than 10 digits from being entered", async () => {
    ERTL.renderRouter("src/app", { initialUrl: "/" })

    typeIntoTestId("Phone Number Field", "01234567890")

    await ERTL.waitFor(() => {
      expect(ERTL.screen).toShowText("(012) 345-6789")
    })
  })

  it("permits editing full phone numbers", async () => {
    ERTL.renderRouter("src/app", { initialUrl: "/" })

    typeIntoTestId("Phone Number Field", "0123456789{Backspace}")

    await ERTL.waitFor(() => {
      expect(ERTL.screen).toShowText("(012) 345-678")
    })
  })

  it("does not allow typing non-digit characters shown on the android number pad keyboard", async () => {
    const nonDigitCharactersShownOnAndroidsNumberPadKeyboard = [
      "-",
      " ",
      ",",
      ".",
    ]
    const enteredCharacters =
      "1" + nonDigitCharactersShownOnAndroidsNumberPadKeyboard.join("") + "23"

    ERTL.renderRouter("src/app", { initialUrl: "/" })

    typeIntoTestId("Phone Number Field", enteredCharacters)

    await ERTL.waitFor(() => {
      expect(ERTL.screen).toShowText("123")
    })
  })

  it("auto removes spaces from phone numbers entered by tapping a full phone number in the suggestion bar above the keyboard", async () => {
    const phoneNumberFromSuggestionBarAboveKeyboard = "012 3456789"
    const formattingOfSuggestedPhoneNumberBeforeThisTestIsPassing =
      "(012)  34-56789"

    ERTL.renderRouter("src/app", { initialUrl: "/" })

    // an intentional fireEvent rather than a userEvent is used here because it
    // more closely simulates what happens when a phone number in the
    // suggestion bar above the keyboard is tapped. More:
    // https://callstack.github.io/react-native-testing-library/docs/api/events/user-event#type
    ERTL.fireEvent(
      ERTL.screen.getByTestId("Phone Number Field"),
      "onChangeText",
      phoneNumberFromSuggestionBarAboveKeyboard,
    )

    await ERTL.waitFor(() => {
      expect(ERTL.screen).not.toShowText(
        formattingOfSuggestedPhoneNumberBeforeThisTestIsPassing,
      )
      expect(ERTL.screen).toShowText("(012) 345-6789")
    })
  })

  describe("when a full phone number has been entered", () => {
    it("shows a continue button", async () => {
      ERTL.renderRouter("src/app", { initialUrl: "/" })

      await ERTL.waitFor(() => {
        expect(ERTL.screen).not.toShowText("Continue")
      })

      typeIntoTestId("Phone Number Field", "0123456789")

      await ERTL.waitFor(() => {
        expect(ERTL.screen).toShowText("Continue")
      })
    })

    describe("when the Continue button is pressed", () => {
      describe("when there is no internet connection", () => {
        it("shows a Trouble Connecting to the Internet message", async () => {
          mockRequest({
            method: "post",
            path: "/text_message_confirmation_codes/deliver",
            params: { phone_number: "0123456789" },
            response: "Network Error",
          })

          ERTL.renderRouter("src/app", { initialUrl: "/" })

          typeIntoTestId("Phone Number Field", "0123456789")

          await ERTL.waitFor(() => {
            expect(ERTL.screen).toShowText("(012) 345-6789")
          })

          ERTL.fireEvent.press(ERTL.screen.getByText("Continue"))

          await ERTL.waitFor(() => {
            expect(ERTL.screen).toShowText("Trouble Connecting to the Internet")
          })
        })
      })

      it("sends a 6-digit text message confirmation code to the user", async () => {
        const sendTextMessageConfirmationCodeRequest = mockRequest({
          method: "post",
          path: "/text_message_confirmation_codes/deliver",
          params: { phone_number: "0123456789" },
        })

        ERTL.renderRouter("src/app", { initialUrl: "/" })

        typeIntoTestId("Phone Number Field", "0123456789")

        await ERTL.waitFor(() => {
          expect(ERTL.screen).toShowText("(012) 345-6789")
        })

        ERTL.fireEvent.press(ERTL.screen.getByText("Continue"))

        await ERTL.waitFor(() => {
          expect(ERTL.screen).not.toShowText("What's your phone number?")
        })

        await ERTL.waitFor(() => {
          expect(sendTextMessageConfirmationCodeRequest.isDone()).toBe(true)
        })
      })

      it("shows an input to enter the confirmation code", async () => {
        mockRequest({
          method: "post",
          path: "/text_message_confirmation_codes/deliver",
          params: { phone_number: "0123456789" },
        })

        ERTL.renderRouter("src/app", { initialUrl: "/" })

        typeIntoTestId("Phone Number Field", "0123456789")

        await ERTL.waitFor(() => {
          expect(ERTL.screen).toShowText("(012) 345-6789")
        })

        ERTL.fireEvent.press(ERTL.screen.getByText("Continue"))

        await ERTL.waitFor(() => {
          expect(ERTL.screen).toShowText("We texted you some numbers")
          expect(ERTL.screen).toShowTestId("Confirmation Code Input")
          expect(ERTL.screen).toShowTestId("Cancel Button")
        })
      })

      describe("when the confirmation code inputs cancel button is tapped", () => {
        it("removes the confirmation code input", async () => {
          mockRequest({
            method: "post",
            path: "/text_message_confirmation_codes/deliver",
            params: { phone_number: "0123456789" },
          })

          ERTL.renderRouter("src/app", { initialUrl: "/" })

          typeIntoTestId("Phone Number Field", "0123456789")

          await ERTL.waitFor(() => {
            expect(ERTL.screen).toShowText("(012) 345-6789")
          })

          ERTL.fireEvent.press(ERTL.screen.getByText("Continue"))

          await ERTL.waitFor(() => {
            expect(ERTL.screen).toShowText("We texted you some numbers")
          })

          ERTL.fireEvent.press(ERTL.screen.getByTestId("Cancel Button"))

          await ERTL.waitFor(() => {
            expect(ERTL.screen).not.toShowText("We texted you some numbers")
            expect(ERTL.screen).toShowText("What's your phone number?")
          })
        })

        it("resets the confirmation code fields value to empty string", async () => {
          mockRequest({
            method: "post",
            path: "/text_message_confirmation_codes/deliver",
            params: { phone_number: "0123456789" },
          })

          ERTL.renderRouter("src/app", { initialUrl: "/" })

          await ERTL.waitFor(() => {
            expect(ERTL.screen.getByTestId("Phone Number Field"))
          })

          typeIntoTestId("Phone Number Field", "0123456789")

          await ERTL.waitFor(() => {
            expect(ERTL.screen.getByText("Continue"))
          })

          ERTL.fireEvent.press(ERTL.screen.getByText("Continue"))

          await ERTL.waitFor(() => {
            expect(ERTL.screen.getByTestId("Confirmation Code Input"))
          })

          ERTL.fireEvent.changeText(
            ERTL.screen.getByTestId("Confirmation Code Input"),
            "123456",
          )

          await ERTL.waitFor(() => {
            expect(ERTL.screen.getByTestId("Cancel Button"))
          })

          ERTL.fireEvent.press(ERTL.screen.getByTestId("Cancel Button"))

          mockRequest({
            method: "post",
            path: "/text_message_confirmation_codes/deliver",
            params: { phone_number: "0123456789" },
          })

          await ERTL.waitFor(() => {
            expect(ERTL.screen.getByTestId("Phone Number Field"))
          })

          await ERTL.waitFor(() => {
            expect(ERTL.screen.getByText("Continue"))
          })

          ERTL.fireEvent.press(ERTL.screen.getByText("Continue"))

          await ERTL.waitFor(() => {
            expect(ERTL.screen.getByTestId("Confirmation Code Input"))
          })

          expect(
            ERTL.screen.getByTestId("Confirmation Code Input").props.value,
          ).toEqual("")
        })
      })

      describe("when the confirmation code inputs CONFIRM button is tapped", () => {
        describe("when there is no internet connection", () => {
          it("shows a Trouble Connecting to the Internet message", async () => {
            mockRequest({
              method: "post",
              path: "/text_message_confirmation_codes/deliver",
              params: { phone_number: "0123456789" },
            })
            mockRequest({
              method: "post",
              path: "/text_message_confirmation_codes/check",
              params: {
                phone_number: "0123456789",
                confirmation_code: "123456",
              },
              response: "Network Error",
            })

            ERTL.renderRouter("src/app", { initialUrl: "/" })

            typeIntoTestId("Phone Number Field", "0123456789")

            await ERTL.waitFor(() => {
              expect(ERTL.screen).toShowText("Continue")
            })

            ERTL.fireEvent.press(ERTL.screen.getByText("Continue"))

            await ERTL.waitFor(() => {
              expect(ERTL.screen).toShowText("We texted you some numbers")
            })

            ERTL.fireEvent.changeText(
              ERTL.screen.getByTestId("Confirmation Code Input"),
              "123456",
            )

            ERTL.fireEvent.press(ERTL.screen.getByText("Confirm"))

            await ERTL.waitFor(async () => {
              expect(ERTL.screen).toShowText(
                "Trouble Connecting to the Internet",
              )
            })
          })
        })

        describe("when the entered code is correct", () => {
          it("signs the user in", async () => {
            mockRequest({
              method: "post",
              path: "/text_message_confirmation_codes/deliver",
              params: { phone_number: "0123456789" },
            })
            mockRequest({
              method: "post",
              path: "/text_message_confirmation_codes/check",
              params: {
                phone_number: "0123456789",
                confirmation_code: "123456",
              },
              response: {
                correct_confirmation_code: true,
                api_token: "api token",
                player_id: 1,
              },
            })
            mockRequest({
              method: "get",
              path: "/teams",
              apiToken: "api token",
              response: [],
            })

            ERTL.renderRouter("src/app", { initialUrl: "/" })

            typeIntoTestId("Phone Number Field", "0123456789")

            await ERTL.waitFor(() => {
              expect(ERTL.screen).toShowText("Continue")
            })

            ERTL.fireEvent.press(ERTL.screen.getByText("Continue"))

            await ERTL.waitFor(() => {
              expect(ERTL.screen).toShowText("We texted you some numbers")
            })

            ERTL.fireEvent.changeText(
              ERTL.screen.getByTestId("Confirmation Code Input"),
              "123456",
            )

            ERTL.fireEvent.press(ERTL.screen.getByText("Confirm"))

            await ERTL.waitFor(async () => {
              const apiToken = await AsyncStorage.getItem("API Token")
              const userId = await AsyncStorage.getItem("User ID")

              expect(apiToken).toEqual("api token")
              expect(userId).toEqual("1")
              expect(ERTL.screen).toHavePathname("/teams")
            })
          })

          it("shows a signout button that signs the user out when tapped", async () => {
            mockRequest({
              method: "post",
              path: "/text_message_confirmation_codes/deliver",
              params: { phone_number: "0123456789" },
            })
            mockRequest({
              method: "post",
              path: "/text_message_confirmation_codes/check",
              params: {
                phone_number: "0123456789",
                confirmation_code: "123456",
              },
              response: {
                correct_confirmation_code: true,
                api_token: "api token",
                player_id: 1,
              },
            })
            mockRequest({
              method: "get",
              path: "/teams",
              apiToken: "api token",
              response: [],
            })

            ERTL.renderRouter("src/app", { initialUrl: "/" })

            typeIntoTestId("Phone Number Field", "0123456789")

            await ERTL.waitFor(() => {
              expect(ERTL.screen).toShowText("Continue")
            })

            ERTL.fireEvent.press(ERTL.screen.getByText("Continue"))

            await ERTL.waitFor(() => {
              expect(ERTL.screen).toShowText("We texted you some numbers")
            })

            ERTL.fireEvent.changeText(
              ERTL.screen.getByTestId("Confirmation Code Input"),
              "123456",
            )

            ERTL.fireEvent.press(ERTL.screen.getByText("Confirm"))

            await ERTL.waitFor(async () => {
              expect(ERTL.screen).toShowTestId("Signout Button")
            })

            ERTL.fireEvent.press(ERTL.screen.getByTestId("Signout Button"))

            await ERTL.waitFor(async () => {
              const apiToken = await AsyncStorage.getItem("API Token")
              const userId = await AsyncStorage.getItem("User ID")

              expect(apiToken).toEqual(null)
              expect(userId).toEqual(null)
              expect(ERTL.screen).toHavePathname("/login")
              expect(ERTL.screen).toShowText("What's your phone number?")
            })

            mockRequest({
              method: "post",
              path: "/text_message_confirmation_codes/deliver",
              params: { phone_number: "0123456789" },
            })

            ERTL.fireEvent.press(ERTL.screen.getByText("Continue"))

            await ERTL.waitFor(() => {
              expect(
                ERTL.screen.getByTestId("Confirmation Code Input").props.value,
              ).toEqual("")
            })
          })
        })

        describe("when the entered code is incorrect the first or second time", () => {
          it("removes the typed in confirmation code", async () => {
            mockRequest({
              method: "post",
              path: "/text_message_confirmation_codes/deliver",
              params: { phone_number: "0123456789" },
            })
            mockRequest({
              method: "post",
              path: "/text_message_confirmation_codes/check",
              params: {
                phone_number: "0123456789",
                confirmation_code: "123456",
              },
              response: {
                correct_confirmation_code: false,
                confirmation_code_was_unset: false,
              },
            })

            ERTL.renderRouter("src/app", { initialUrl: "/" })

            typeIntoTestId("Phone Number Field", "0123456789")

            await ERTL.waitFor(() => {
              expect(ERTL.screen).toShowText("Continue")
            })

            ERTL.fireEvent.press(ERTL.screen.getByText("Continue"))

            await ERTL.waitFor(() => {
              expect(ERTL.screen).toShowText("We texted you some numbers")
            })

            ERTL.fireEvent.changeText(
              ERTL.screen.getByTestId("Confirmation Code Input"),
              "123456",
            )

            ERTL.fireEvent.press(ERTL.screen.getByText("Confirm"))

            await ERTL.waitFor(async () => {
              expect(
                ERTL.screen.getByTestId("Confirmation Code Input").props.value,
              ).toEqual("")
            })
          })
        })

        describe("when the entered code is incorrect the third time", () => {
          it("removes the confirmation code input", async () => {
            mockRequest({
              method: "post",
              path: "/text_message_confirmation_codes/deliver",
              params: { phone_number: "0123456789" },
            })
            mockRequest({
              method: "post",
              path: "/text_message_confirmation_codes/check",
              params: {
                phone_number: "0123456789",
                confirmation_code: "123456",
              },
              response: {
                correct_confirmation_code: false,
                confirmation_code_was_unset: true,
              },
            })

            ERTL.renderRouter("src/app", { initialUrl: "/" })

            typeIntoTestId("Phone Number Field", "0123456789")

            await ERTL.waitFor(() => {
              expect(ERTL.screen).toShowText("Continue")
            })

            ERTL.fireEvent.press(ERTL.screen.getByText("Continue"))

            await ERTL.waitFor(() => {
              expect(ERTL.screen).toShowText("We texted you some numbers")
            })

            ERTL.fireEvent.changeText(
              ERTL.screen.getByTestId("Confirmation Code Input"),
              "123456",
            )

            ERTL.fireEvent.press(ERTL.screen.getByText("Confirm"))

            await ERTL.waitFor(async () => {
              expect(ERTL.screen).not.toShowTestId("Confirmation Code Input")
            })
          })
        })
      })
    })
  })
})
