import { useState, useCallback, useEffect } from 'react'
import { clamp as _clamp } from 'lodash'

// component
export const useCarouselState = (
  maxIndex: number,
  index: number | undefined = undefined,
  infinite: boolean = false,
  interval: number = 0
) => {
  // state
  const [curIndex, setCurIndex] = useState(0)

  // handlers
  const handleChange = useCallback(
    (newIndex: number) => {
      // keep values within range, but allow infinite rollover
      const infiniteIndex = newIndex < 0 ? maxIndex - (Math.abs(newIndex) % maxIndex) : newIndex % maxIndex
      // keep values within range, but allow clamp values
      const clampedIndex = _clamp(newIndex, 0, maxIndex)
      setCurIndex(infinite ? infiniteIndex : clampedIndex)
    },
    [infinite, maxIndex]
  )
  const handlePrev = useCallback(() => {
    handleChange(curIndex - 1)
  }, [curIndex, handleChange])
  const handleNext = useCallback(() => {
    handleChange(curIndex + 1)
  }, [curIndex, handleChange])

  // handle parent changes
  useEffect(() => {
    if (typeof index === 'number') setCurIndex(index)
  }, [index])

  // interval timer
  useEffect(() => {
    let timer
    if (interval) {
      timer = setInterval(() => handleNext(), interval)
    }
    return () => {
      if (timer) clearInterval(timer)
    }
  }, [interval, handleNext])

  // return
  return [index, handleNext, handlePrev, handleChange]
}
