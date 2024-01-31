// https://docs.expo.dev/workflow/configuration/

import type { ExpoConfig, ConfigContext } from "expo/config"

const expoAppId = "e823ae4c-6414-49a2-b931-8a090a1a97d3"

export default ({ config }: ConfigContext): ExpoConfig => ({
  slug: "too-many-men",
  ...config,
  name: process.env.APP_NAME || config.name || "Too Many Men",
  extra: {
    eas: {
      projectId: expoAppId,
    },
  },
  updates: {
    url: `https://u.expo.dev/${expoAppId}`,
  },
})
