export interface Candidate {
  name: string
  votes: number
}

export type CandidateVotes = Record<Candidate['name'], Candidate['votes']>

export interface Winner {
  name: string
  position: string
  confirmed?: boolean
}

export interface ElectionState {
  title: string
  candidate: CandidateVotes
  winner: Winner[]
}

export type Unsubscribe = () => void

export interface ElectionCommands {
  openSubWindow: () => Promise<void>
  openWinnerWindow: () => Promise<void>
  openElectionWindow: () => Promise<void>
  getElectionTitle: () => Promise<string>
  setElectionTitle: (title: string) => Promise<string>
  getCandidate: () => Promise<CandidateVotes>
  addCandidate: (name: string) => Promise<CandidateVotes>
  removeCandidate: (name: string) => Promise<CandidateVotes>
  removeAllCandidate: () => Promise<CandidateVotes>
  vote: (name: string) => Promise<CandidateVotes>
  removeVote: (name: string) => Promise<CandidateVotes>
  getWinner: () => Promise<Winner[]>
  setWinner: (winners: Winner[]) => Promise<Winner[]>
  addWinner: (winner: Winner) => Promise<Winner[]>
  removeWinner: (name: string) => Promise<Winner[]>
  confirmWinner: (winner: Winner) => Promise<Winner>
}

export const IPC_CHANNELS = {
  openSubWindow: 'open-sub-window',
  openWinnerWindow: 'open-winner-window',
  openElectionWindow: 'open-election-window',
  getElectionTitle: 'get-election-title',
  setElectionTitle: 'set-election-title',
  getCandidate: 'get-candidate',
  addCandidate: 'add-candidate',
  removeCandidate: 'remove-candidate',
  removeAllCandidate: 'remove-all-candidate',
  vote: 'vote-candidate',
  removeVote: 'remove-vote',
  getWinner: 'get-winner',
  setWinner: 'set-winner',
  addWinner: 'add-winner',
  removeWinner: 'remove-winner',
  confirmWinner: 'confirm-winner'
} as const satisfies Record<keyof ElectionCommands, string>

export const IPC_EVENTS = {
  votes: 'vote-updated',
  title: 'title-updated',
  winners: 'winner-updated',
  winnerConfirmed: 'winner-confirmed'
} as const

export interface ElectionEvents {
  [IPC_EVENTS.votes]: CandidateVotes
  [IPC_EVENTS.title]: string
  [IPC_EVENTS.winners]: Winner[]
  [IPC_EVENTS.winnerConfirmed]: Winner
}

export interface ElectionApi extends ElectionCommands {
  onVoteUpdated: (callback: (votes: CandidateVotes) => void) => Unsubscribe
  onTitleUpdated: (callback: (title: string) => void) => Unsubscribe
  onWinnerUpdated: (callback: (winners: Winner[]) => void) => Unsubscribe
  onWinnerConfirmed: (callback: (winner: Winner) => void) => Unsubscribe
}
