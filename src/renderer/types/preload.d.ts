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
      setWinner: (winner: Record<string, string>[]) => Promise<Record<string, string>[]>
      addWinner: (winner: Record<string, string>) => Promise<Record<string, string>[]>

      vote: (candidateId: string) => Promise<Record<string, number>>
      onVoteUpdated: (callback: (votes: Record<string, number>) => void) => () => void
      onTitleUpdated: (callback: (title: string) => void) => () => void
      onWinnerUpdated: (callback: (winner: Record<string, string>[]) => void) => () => void
      removeCandidate: (candidateId: string) => Promise<Record<string, number>>
      removeAllCandidate: () => Promise<Record<string, number>>
      removeVote: (candidateId: string) => Promise<Record<string, number>>
      removeWinner: (name: string) => Promise<Record<string, number>>
    }
  }
}
