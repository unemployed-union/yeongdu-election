import { contextBridge, ipcRenderer } from 'electron'
import { IPC_CHANNELS, IPC_EVENTS } from '../shared/election'
import type { ElectionApi, ElectionCommands, ElectionEvents, Unsubscribe } from '../shared/election'

function invoke<K extends keyof ElectionCommands>(
  command: K,
  ...args: Parameters<ElectionCommands[K]>
): ReturnType<ElectionCommands[K]> {
  return ipcRenderer.invoke(IPC_CHANNELS[command], ...args) as ReturnType<ElectionCommands[K]>
}

function subscribe<K extends keyof ElectionEvents>(
  channel: K,
  callback: (value: ElectionEvents[K]) => void
): Unsubscribe {
  const listener = (_event: Electron.IpcRendererEvent, value: ElectionEvents[K]): void => {
    callback(value)
  }
  ipcRenderer.on(channel, listener)
  return () => {
    ipcRenderer.removeListener(channel, listener)
  }
}

const api: ElectionApi = {
  openSubWindow: () => invoke('openSubWindow'),
  openWinnerWindow: () => invoke('openWinnerWindow'),
  openElectionWindow: () => invoke('openElectionWindow'),
  getElectionTitle: () => invoke('getElectionTitle'),
  setElectionTitle: (title) => invoke('setElectionTitle', title),
  getCandidate: () => invoke('getCandidate'),
  addCandidate: (name) => invoke('addCandidate', name),
  removeCandidate: (name) => invoke('removeCandidate', name),
  removeAllCandidate: () => invoke('removeAllCandidate'),
  vote: (name) => invoke('vote', name),
  removeVote: (name) => invoke('removeVote', name),
  getWinner: () => invoke('getWinner'),
  setWinner: (winners) => invoke('setWinner', winners),
  addWinner: (winner) => invoke('addWinner', winner),
  removeWinner: (name) => invoke('removeWinner', name),
  confirmWinner: (winner) => invoke('confirmWinner', winner),
  onVoteUpdated: (callback) => subscribe(IPC_EVENTS.votes, callback),
  onTitleUpdated: (callback) => subscribe(IPC_EVENTS.title, callback),
  onWinnerUpdated: (callback) => subscribe(IPC_EVENTS.winners, callback),
  onWinnerConfirmed: (callback) => subscribe(IPC_EVENTS.winnerConfirmed, callback)
}

contextBridge.exposeInMainWorld('api', api)
