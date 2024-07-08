import React from "react"
import { View, Text, Pressable } from "react-native"
import Animated, { BounceInUp, SlideOutUp } from "react-native-reanimated"
import { createContext, useMemo, useState } from "react"
import { AntDesign } from "@expo/vector-icons"
import { useWindowDimensions } from "react-native"
import { getDefaultHeaderHeight } from "@react-navigation/elements"
import Constants from "expo-constants"
import useTheme from "hooks/useTheme"

const useHeaderHeight = (): number => {
  const { width, height } = useWindowDimensions()
  const headerHeight = useMemo(
    () =>
      getDefaultHeaderHeight(
        { width, height },
        false,
        Constants.statusBarHeight,
      ),
    [width, height],
  )
  return headerHeight
}

const secondsToMillisecondsMultiplier = 1000

const extraHeightToPreventWhitespaceShowingAboveBounceInAnimation = 50
const showOnTopOfNavigationHeader = { zIndex: 1 }

// type Type = "success" | "warning" | "error" | "info"
type Type = "warning"

type NotificationType = { type: Type; message: string; dismissAfter?: number }
type DisplayedNotificationType = NotificationType | undefined

export interface NavigationHeaderToastNotificationContextType {
  showNotification: ({ type, message, dismissAfter }: NotificationType) => void
  displayedNotification: DisplayedNotificationType
  dismissNotification: () => void
}

const noOperation = (): void => {}
noOperation()

const NavigationHeaderToastNotificationContext =
  createContext<NavigationHeaderToastNotificationContextType>({
    showNotification: noOperation,
    displayedNotification: undefined,
    dismissNotification: noOperation,
  })

const AnimatedContainer = Animated.createAnimatedComponent(View)

interface NavigationHeaderToastNotificationProps {
  children: React.ReactElement | React.ReactElement[]
}

const NavigationHeaderToastNotificationProvider = ({
  children,
}: NavigationHeaderToastNotificationProps): React.ReactElement => {
  const theme = useTheme()

  const [message, setMessage] = useState<string>("")
  const [isShowing, setIsShowing] = useState<boolean>(false)

  // const [type, setType] = useState<Type>("success")
  const [type, setType] = useState<Type>("warning")

  const headerHeight = useHeaderHeight()

  const dismissNotification = (): void => setIsShowing(false)

  const showNotification = React.useCallback(
    ({ type, message, dismissAfter }: NotificationType): void => {
      setType(type)
      setMessage(message)
      setIsShowing(true)
      if (dismissAfter != undefined) {
        setTimeout(() => {
          /* c8 ignore start */
          // unsure how to test real-time-dependent things
          dismissNotification()
          /* c8 ignore end */
        }, dismissAfter * secondsToMillisecondsMultiplier)
      }
    },
    [],
  )

  const displayedNotification = useMemo(() => {
    if (isShowing) {
      return {
        type,
        message,
      }
    } else {
      return undefined
    }
  }, [isShowing, type, message])

  const attributes = useMemo(() => {
    switch (type) {
      // case "success":
      //   return {
      //     backgroundColor: "#ebf7ee",
      //     borderColor: "#bde5c8",
      //     icon: <AntDesign name="check" size={22} color="#3ebe61" />,
      //   }
      // case "error":
      //   return {
      //     backgroundColor: "#FCECE9",
      //     borderColor: "#F5C5BB",
      //     icon: <AntDesign name="closecircleo" size={22} color="#eb4d2c" />,
      //   }
      // case "info":
      //   return {
      //     backgroundColor: "#e5eefa",
      //     borderColor: "#abcdf1",
      //     icon: <AntDesign name="infocirlceo" size={22} color="#016de5" />,
      //   }
      case "warning":
        return {
          backgroundColor: "#fef7ea",
          borderColor: "#fadeae",
          icon: (
            <AntDesign name="exclamationcircleo" size={22} color="#ef9400" />
          ),
        }
    }
  }, [type])

  return (
    <NavigationHeaderToastNotificationContext.Provider
      value={{ showNotification, dismissNotification, displayedNotification }}
    >
      <Pressable
        onPress={(): void => dismissNotification()}
        style={showOnTopOfNavigationHeader}
      >
        {isShowing && (
          <AnimatedContainer entering={BounceInUp} exiting={SlideOutUp}>
            <View
              style={{
                position: "absolute",
                top: -extraHeightToPreventWhitespaceShowingAboveBounceInAnimation,
                left: 0,
                width: "100%",
                height:
                  headerHeight +
                  extraHeightToPreventWhitespaceShowingAboveBounceInAnimation,
                backgroundColor: attributes.backgroundColor,
                alignItems: "flex-end",
                justifyContent: "center",
                paddingLeft: 10,
                paddingRight: 10,
                paddingBottom: 3,
                borderBottomColor: attributes.borderColor,
                borderBottomWidth: 1,
                flexDirection: "row",
              }}
            >
              {attributes.icon}
              <View style={{ width: 3 }} />
              <Text
                style={{
                  fontSize: theme.fontSize,
                  fontWeight: "bold",
                }}
              >
                {message}
              </Text>
            </View>
          </AnimatedContainer>
        )}
      </Pressable>
      {children}
    </NavigationHeaderToastNotificationContext.Provider>
  )
}

export default {
  Context: NavigationHeaderToastNotificationContext,
  Provider: NavigationHeaderToastNotificationProvider,
}
