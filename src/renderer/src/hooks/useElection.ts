import { useEffect, useState } from 'react'
import type { CandidateVotes, Unsubscribe, Winner } from '../../../shared/election'
import { subscribeToValue } from '../lib/subscription'

function useElectionValue<T>(
  initialValue: T,
  load: () => Promise<T>,
  subscribe: (callback: (value: T) => void) => Unsubscribe
): T {
  const [value, setValue] = useState(initialValue)

  useEffect(() => subscribeToValue(load, subscribe, setValue, console.error), [load, subscribe])

  return value
}

export function useCandidates(): CandidateVotes {
  return useElectionValue<CandidateVotes>({}, window.api.getCandidate, window.api.onVoteUpdated)
}

export function useWinners(): Winner[] {
  return useElectionValue<Winner[]>([], window.api.getWinner, window.api.onWinnerUpdated)
}

export function useElectionTitle(): string {
  return useElectionValue('', window.api.getElectionTitle, window.api.onTitleUpdated)
}
