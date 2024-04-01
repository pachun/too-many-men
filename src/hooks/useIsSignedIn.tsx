import React from "react"
import useApiToken from "hooks/useApiToken"
import useUserId from "hooks/useUserId"

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
