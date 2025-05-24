import { useEffect, useState } from 'react'

/**
 * @return True, if component was mounted.
 */
export function useDidMount(): boolean {
  const [didMount, setDidMount] = useState(false)

  useEffect(() => {
    setTimeout(() => setDidMount(true), 1000)
  }, [])

  return didMount
}
