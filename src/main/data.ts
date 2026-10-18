import type { CandidateVotes, ElectionState, Winner } from '../shared/election'

export class ElectionStore {
  private state: ElectionState = { title: '', candidate: {}, winner: [] }

  getTitle(): string {
    return this.state.title
  }

  setTitle(title: string): string {
    this.state.title = title
    return this.getTitle()
  }

  getCandidates(): CandidateVotes {
    return { ...this.state.candidate }
  }

  addCandidate(name: string): CandidateVotes {
    const candidateName = name.trim()
    if (candidateName && !Object.hasOwn(this.state.candidate, candidateName)) {
      this.state.candidate = { ...this.state.candidate, [candidateName]: 0 }
    }
    return this.getCandidates()
  }

  vote(name: string): CandidateVotes {
    return this.changeVote(name, 1)
  }

  removeVote(name: string): CandidateVotes {
    return this.changeVote(name, -1)
  }

  private changeVote(name: string, amount: number): CandidateVotes {
    if (Object.hasOwn(this.state.candidate, name)) {
      this.state.candidate[name] = Math.max(0, this.state.candidate[name] + amount)
    }
    return this.getCandidates()
  }

  removeCandidate(name: string): CandidateVotes {
    delete this.state.candidate[name]
    return this.getCandidates()
  }

  removeAllCandidates(): CandidateVotes {
    this.state.candidate = {}
    return this.getCandidates()
  }

  getWinners(): Winner[] {
    return this.state.winner.map((winner) => ({ ...winner }))
  }

  setWinners(winners: Winner[]): Winner[] {
    this.state.winner = winners.map((winner) => ({ ...winner }))
    return this.getWinners()
  }

  addWinner(winner: Winner): Winner[] {
    this.state.winner.push({ ...winner })
    return this.getWinners()
  }

  removeWinner(name: string): Winner[] {
    this.state.winner = this.state.winner.filter((winner) => winner.name !== name)
    return this.getWinners()
  }
}
