import React from "react"
import useApiToken from "./useApiToken"
import useUserId from "./useUserId"

const useIsSignedIn = (): boolean => {
  const { apiToken } = useApiToken()
  const { userId } = useUserId()

  const isSignedIn = React.useMemo(
    () => Boolean(apiToken) && Boolean(userId),
    [apiToken, userId],
  )

  return isSignedIn
}

export default useIsSignedIn
