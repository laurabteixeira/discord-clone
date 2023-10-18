import { useEffect, useState } from 'react'

export const useOrigin = () => {
  const [wasRendered, setWasRendered] = useState(false)

  useEffect(() => {
    setWasRendered(true)
  }, [])

  const origin =
    typeof window !== 'undefined' && window.location.origin
      ? window.location.origin
      : ''

  if (!wasRendered) {
    return ''
  }

  return origin
}
