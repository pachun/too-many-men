import React from "react"

const updateFrequencyInSeconds = 1
const millisecondsInASecond = 1000

const useEffectEverySecond = (effect: () => void): void => {
  React.useEffect(() => {
    const intervalId = setInterval(() => {
      effect()
    }, updateFrequencyInSeconds * millisecondsInASecond)

    effect()

    return (): void => clearInterval(intervalId)
  }, [effect])
}

export default useEffectEverySecond
