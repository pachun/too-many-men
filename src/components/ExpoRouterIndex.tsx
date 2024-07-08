import React from "react"
import * as ExpoRouter from "expo-router"

interface ExpoRouterIndexProps {
  indexPath: string
}

const ExpoRouterIndex = ({
  indexPath,
}: ExpoRouterIndexProps): React.ReactElement => {
  const pathname = ExpoRouter.usePathname()

  const href = React.useMemo(
    () => (pathname === "/" ? indexPath : `${pathname}/${indexPath}`),
    [pathname, indexPath],
  )

  return <ExpoRouter.Redirect href={href} />
}

export default ExpoRouterIndex
