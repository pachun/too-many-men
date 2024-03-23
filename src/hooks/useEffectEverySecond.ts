import React from "react"

const useEffectEverySecond = (effect: () => void): void => {
  React.useEffect(() => {
    const intervalId = setInterval(() => {
      effect()
    }, 1000)

    effect()

    return (): void => clearInterval(intervalId)
  }, [effect])
}

export default useEffectEverySecond
