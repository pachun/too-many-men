import React from "react"
import type { Provider as ProviderType } from "types/Provider"

interface ComposeProvidersProps {
  providers: ProviderType[]
  children: React.ReactElement
}

const ComposedProviders = ({
  providers,
  children,
}: ComposeProvidersProps): React.ReactElement => {
  return providers.reduceRight((acc, CurrentProvider) => {
    return <CurrentProvider>{acc}</CurrentProvider>
  }, children)
}

export default ComposedProviders
