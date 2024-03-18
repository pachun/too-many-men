import React from "react"
import { ApiTokenContext } from "components/ApiTokenProvider"
import type { ApiTokenContextType } from "components/ApiTokenProvider"

const useApiToken = (): ApiTokenContextType => {
  const { apiToken, setApiToken } = React.useContext(ApiTokenContext)

  return { apiToken, setApiToken }
}

export default useApiToken
