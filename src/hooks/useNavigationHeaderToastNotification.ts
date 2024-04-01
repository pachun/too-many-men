import React from "react"
import NavigationHeaderToastNotification from "components/NavigationHeaderToastNotification"
import type { NavigationHeaderToastNotificationContextType } from "components/NavigationHeaderToastNotification"

const useNavigationHeaderToastNotification =
  (): NavigationHeaderToastNotificationContextType =>
    React.useContext(NavigationHeaderToastNotification.Context)

export default useNavigationHeaderToastNotification
