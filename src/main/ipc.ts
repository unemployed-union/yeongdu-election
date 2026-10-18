import { BrowserWindow, ipcMain } from 'electron'
import { IPC_CHANNELS, IPC_EVENTS } from '../shared/election'
import type { ElectionCommands, ElectionEvents } from '../shared/election'
import { ElectionStore } from './data'
import { createWindow } from './window'

function handle<K extends keyof ElectionCommands>(
  command: K,
  handler: (...args: Parameters<ElectionCommands[K]>) => Awaited<ReturnType<ElectionCommands[K]>>
): void {
  ipcMain.handle(IPC_CHANNELS[command], (_event, ...args: Parameters<ElectionCommands[K]>) =>
    handler(...args)
  )
}

function publish<K extends keyof ElectionEvents>(
  channel: K,
  value: ElectionEvents[K]
): ElectionEvents[K] {
  for (const window of BrowserWindow.getAllWindows()) {
    if (!window.webContents.isDestroyed()) {
      window.webContents.send(channel, value)
    }
  }
  return value
}

export function registerElectionIpc(store: ElectionStore): void {
  handle('openSubWindow', () => {
    createWindow('title')
  })
  handle('openWinnerWindow', () => {
    createWindow('winner')
  })
  handle('openElectionWindow', () => {
    createWindow('election')
  })

  handle('getElectionTitle', () => store.getTitle())
  handle('setElectionTitle', (title) => publish(IPC_EVENTS.title, store.setTitle(title)))

  handle('getCandidate', () => store.getCandidates())
  handle('addCandidate', (name) => publish(IPC_EVENTS.votes, store.addCandidate(name)))
  handle('vote', (name) => publish(IPC_EVENTS.votes, store.vote(name)))
  handle('removeVote', (name) => publish(IPC_EVENTS.votes, store.removeVote(name)))
  handle('removeCandidate', (name) => publish(IPC_EVENTS.votes, store.removeCandidate(name)))
  handle('removeAllCandidate', () => publish(IPC_EVENTS.votes, store.removeAllCandidates()))

  handle('getWinner', () => store.getWinners())
  handle('setWinner', (winners) => publish(IPC_EVENTS.winners, store.setWinners(winners)))
  handle('addWinner', (winner) => publish(IPC_EVENTS.winners, store.addWinner(winner)))
  handle('removeWinner', (name) => publish(IPC_EVENTS.winners, store.removeWinner(name)))
  handle('confirmWinner', (winner) => {
    const confirmed = store.confirmWinner(winner)
    publish(IPC_EVENTS.winners, store.getWinners())
    return publish(IPC_EVENTS.winnerConfirmed, confirmed)
  })
}
