import type { Unsubscribe } from '../../../shared/election'

// Subscribe first so an update arriving during the initial request cannot be lost.
export function subscribeToValue<T>(
  load: () => Promise<T>,
  subscribe: (callback: (value: T) => void) => Unsubscribe,
  onValue: (value: T) => void,
  onError: (error: unknown) => void
): Unsubscribe {
  let active = true
  let updated = false

  const unsubscribe = subscribe((value) => {
    if (!active) return
    updated = true
    onValue(value)
  })

  void load().then(
    (value) => {
      if (active && !updated) onValue(value)
    },
    (error: unknown) => {
      if (active && !updated) onError(error)
    }
  )

  return () => {
    active = false
    unsubscribe()
  }
}
