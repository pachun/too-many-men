// We don't test analytics, though we probably should

//* c8 ignore start */
import Aptabase, { trackEvent } from "@aptabase/react-native"

export const trackAptabaseEvent = (event: string): void => {
  if (!__DEV__ && process.env.NODE_ENV !== "jest") {
    trackEvent(event)
  }
}

export const initializeAptabase = (): void => {
  if (!__DEV__ && process.env.NODE_ENV !== "jest") {
    Aptabase.init("A-US-5581263895")
  }
}
//* c8 ignore end */
