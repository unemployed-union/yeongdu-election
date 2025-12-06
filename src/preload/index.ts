// import { electronAPI } from '@electron-toolkit/preload'
import { contextBridge, ipcRenderer } from 'electron'
import { get } from 'http'

// Custom APIs for renderer
const api = {
  openSubWindow: () => ipcRenderer.invoke('open-sub-window'),
  openWinnerWindow: () => ipcRenderer.invoke('open-winner-window'),
  openElectionWindow: () => ipcRenderer.invoke('open-election-window'),

  getElectionTitle: (): Promise<string> => ipcRenderer.invoke('get-election-title'),
  getCandidate: (): Promise<Record<string, number>> => ipcRenderer.invoke('get-candidate'),
  getWinner: (): Promise<Record<string, string>> => ipcRenderer.invoke('get-winner'),

  removeCandidate: (candidateId: string): Promise<Record<string, number>> =>
    ipcRenderer.invoke('remove-candidate', candidateId),
  removeAllCandidate: (): Promise<Record<string, number>> =>
    ipcRenderer.invoke('remove-all-candidate'),
  removeVote: (candidateId: string): Promise<Record<string, number>> =>
    ipcRenderer.invoke('remove-vote', candidateId),
  removeWinner: (name: string): Promise<Record<string, number>> =>
    ipcRenderer.invoke('remove-winner', name),
  vote: (candidateId: string): Promise<Record<string, number>> =>
    ipcRenderer.invoke('vote-candidate', candidateId),

  setElectionTitle: (title: string): Promise<string> =>
    ipcRenderer.invoke('set-election-title', title),
  setWinner: (winner: Record<string, string>): Promise<Record<string, string>[]> =>
    ipcRenderer.invoke('set-winner', winner),
  addWinner: (winner: Record<string, string>): Promise<Record<string, string>[]> =>
    ipcRenderer.invoke('add-winner', winner),

  onVoteUpdated: (callback: (votes: Record<string, number>) => void): (() => void) => {
    const listener = (_event: unknown, votes: Record<string, number>): void => {
      callback(votes)
    }
    ipcRenderer.on('vote-updated', listener)

    // 구독 해제용 함수 리턴
    return () => {
      ipcRenderer.removeListener('vote-updated', listener)
    }
  },
  onTitleUpdated: (callback: (title: string) => void): (() => void) => {
    const listener = (_event: unknown, title: string): void => {
      callback(title)
    }
    ipcRenderer.on('title-updated', listener)

    // 구독 해제용 함수 리턴
    return () => {
      ipcRenderer.removeListener('title-updated', listener)
    }
  },
  onWinnerUpdated: (callback: (winner: Record<string, string>[]) => void): (() => void) => {
    const listener = (_event: unknown, winner: Record<string, string>[]): void => {
      callback(winner)
    }
    ipcRenderer.on('winner-updated', listener)

    // 구독 해제용 함수 리턴
    return () => {
      ipcRenderer.removeListener('winner-updated', listener)
    }
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    // contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  // window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
