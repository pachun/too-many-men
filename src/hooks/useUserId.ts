import React from "react"
import { UserIdContext } from "components/UserIdProvider"
import type { UserIdContextType } from "components/UserIdProvider"

const useUserId = (): UserIdContextType => {
  const { userId, setUserId } = React.useContext(UserIdContext)

  return { userId, setUserId }
}

export default useUserId
