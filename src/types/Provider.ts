import type { Children } from "./Children"

export type Provider = ({
  children,
}: {
  children: Children
}) => React.ReactElement
