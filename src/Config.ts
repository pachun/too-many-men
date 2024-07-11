// https://docs.expo.dev/eas-update/environment-variables/

import * as Updates from "expo-updates"

const Config = {
  apiUrl: process.env.EXPO_PUBLIC_API_URL || "http://192.168.1.33:3000",
  // apiUrl: "https://too-many-men-api-8dcb4a385e6b.herokuapp.com",
}

if (Updates.channel === "production") {
  Config.apiUrl = "https://too-many-men-api-8dcb4a385e6b.herokuapp.com"
} else if (Updates.channel === "preview") {
  Config.apiUrl = "https://too-many-men-api-8dcb4a385e6b.herokuapp.com"
}

export default Config
