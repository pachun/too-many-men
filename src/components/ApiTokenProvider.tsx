import React from "react"
import type { AuthenticationContext as AuthenticationContextType } from "types/AuthenticationContext"

const AuthenticationContext = React.createContext<AuthenticationContextType>({
  apiToken: undefined,
})

export default AuthenticationContext
