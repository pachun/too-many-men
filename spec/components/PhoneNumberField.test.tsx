import React from "react"
import * as ReactNative from "react-native"
import * as RNTL from "@testing-library/react-native"
import PhoneNumberField from "components/PhoneNumberField"
import typeIntoTestId from "spec/specHelpers/typeIntoTestId"

const PhoneNumberFieldTestHelper = (): React.ReactElement => {
  const [phoneNumber, setPhoneNumber] = React.useState("")

  return (
    <>
      <ReactNative.Text>{phoneNumber}</ReactNative.Text>
      <PhoneNumberField
        testID="Phone Number Field"
        phoneNumber={phoneNumber}
        onChangePhoneNumber={setPhoneNumber}
      />
    </>
  )
}

describe("The Phone Number Field Component", () => {
  it("accepts and applies any ReactNative.TextField props", () => {
    RNTL.render(
      <PhoneNumberField
        placeholder="Phone Number"
        phoneNumber=""
        onChangePhoneNumber={() => {}}
      />,
    )

    expect(RNTL.screen.getByPlaceholderText("Phone Number"))
  })

  it("defaults its keyboardType to number-pad", () => {
    RNTL.render(
      <PhoneNumberField
        testID="Phone Number Field"
        phoneNumber=""
        onChangePhoneNumber={() => {}}
      />,
    )

    const phoneNumberField = RNTL.screen.getByTestId("Phone Number Field")

    expect(phoneNumberField.props.keyboardType).toEqual("number-pad")
  })

  it("defaults its textContentType to telephoneNumber", () => {
    RNTL.render(
      <PhoneNumberField
        testID="Phone Number Field"
        phoneNumber=""
        onChangePhoneNumber={() => {}}
      />,
    )

    const phoneNumberField = RNTL.screen.getByTestId("Phone Number Field")

    expect(phoneNumberField.props.textContentType).toEqual("telephoneNumber")
  })

  describe("given a digit-only initial phone number", () => {
    it("formats the initially displayed phone number", () => {
      RNTL.render(
        <PhoneNumberField
          testID="Phone Number Field"
          phoneNumber="0123456789"
          onChangePhoneNumber={() => {}}
        />,
      )

      const phoneNumberField = RNTL.screen.getByTestId("Phone Number Field")

      expect(phoneNumberField.props.value).toEqual("(012) 345-6789")
    })
  })

  describe("when digits are entered", () => {
    it("does not permit entering more characters than are in a single full phone number", async () => {
      RNTL.render(<PhoneNumberFieldTestHelper />)

      const phoneNumberField = RNTL.screen.getByTestId("Phone Number Field")

      await RNTL.waitFor(() => {
        expect(phoneNumberField.props.maxLength).toEqual(
          "(000) 000-0000".length,
        )
      })
    })

    it("formats the phone number in the text field and returns the unformatted phone number to the controlling component with onChangePhoneNumber", async () => {
      RNTL.render(<PhoneNumberFieldTestHelper />)

      const phoneNumberField = RNTL.screen.getByTestId("Phone Number Field")

      typeIntoTestId("Phone Number Field", "0")

      await RNTL.waitFor(() => {
        expect(phoneNumberField.props.value).toEqual("0")
        expect(RNTL.screen.getByText("0"))
      })

      typeIntoTestId("Phone Number Field", "1")

      await RNTL.waitFor(() => {
        expect(phoneNumberField.props.value).toEqual("01")
        expect(RNTL.screen.getByText("01"))
      })

      typeIntoTestId("Phone Number Field", "2")

      await RNTL.waitFor(() => {
        expect(phoneNumberField.props.value).toEqual("012")
        expect(RNTL.screen.getByText("012"))
      })

      typeIntoTestId("Phone Number Field", "3")

      await RNTL.waitFor(() => {
        expect(phoneNumberField.props.value).toEqual("(012) 3")
        expect(RNTL.screen.getByText("0123"))
      })

      typeIntoTestId("Phone Number Field", "4")

      await RNTL.waitFor(() => {
        expect(phoneNumberField.props.value).toEqual("(012) 34")
        expect(RNTL.screen.getByText("01234"))
      })

      typeIntoTestId("Phone Number Field", "5")

      await RNTL.waitFor(() => {
        expect(phoneNumberField.props.value).toEqual("(012) 345")
        expect(RNTL.screen.getByText("012345"))
      })

      typeIntoTestId("Phone Number Field", "6")

      await RNTL.waitFor(() => {
        expect(phoneNumberField.props.value).toEqual("(012) 345-6")
        expect(RNTL.screen.getByText("0123456"))
      })

      typeIntoTestId("Phone Number Field", "7")

      await RNTL.waitFor(() => {
        expect(phoneNumberField.props.value).toEqual("(012) 345-67")
        expect(RNTL.screen.getByText("01234567"))
      })

      typeIntoTestId("Phone Number Field", "8")

      await RNTL.waitFor(() => {
        expect(phoneNumberField.props.value).toEqual("(012) 345-678")
        expect(RNTL.screen.getByText("012345678"))
      })

      typeIntoTestId("Phone Number Field", "9")

      await RNTL.waitFor(() => {
        expect(phoneNumberField.props.value).toEqual("(012) 345-6789")
        expect(RNTL.screen.getByText("0123456789"))
      })
    })
  })
})
