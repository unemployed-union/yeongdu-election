import { useState } from 'react'

export function useAsyncAction(): {
  pending: boolean
  error: string
  run: (action: () => Promise<unknown>) => Promise<boolean>
} {
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')

  async function run(action: () => Promise<unknown>): Promise<boolean> {
    setPending(true)
    setError('')
    try {
      await action()
      return true
    } catch {
      setError('변경 사항을 저장하지 못했어요. 다시 시도해 주세요.')
      return false
    } finally {
      setPending(false)
    }
  }

  return { pending, error, run }
}
