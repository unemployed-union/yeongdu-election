// src/renderer/types/preload.d.ts
export {}

declare global {
  interface Window {
    api: {
      openSubWindow: () => Promise<void>
      openWinnerWindow: () => Promise<void>
      openElectionWindow: () => Promise<void>

      getElectionTitle: () => Promise<string>
      getCandidate: () => Promise<Record<string, number>>
      getWinner: () => Promise<Record<string, string>[]>
      setElectionTitle: (title: string) => Promise<string>
      vote: (candidateId: string) => Promise<Record<string, number>>
      onVoteUpdated: (callback: (votes: Record<string, number>) => void) => () => void
      onTitleUpdated: (callback: (title: string) => void) => () => void
      onWinnerUpdated: (callback: (winner: Record<string, string>[]) => void) => () => void
      setWinner: (winner: Record<string, string>[]) => Promise<Record<string, string>[]>
      removeCandidate: (candidateId: string) => Promise<Record<string, number>>
      removeVote: (candidateId: string) => Promise<Record<string, number>>
    }
  }
}
