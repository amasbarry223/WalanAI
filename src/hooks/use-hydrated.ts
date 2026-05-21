'use client'

import { useEffect, useState } from 'react'

/** Indique que le composant est monté côté client (évite les mismatches SSR). */
export function useHydrated() {
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setHydrated(true)
  }, [])

  return hydrated
}
