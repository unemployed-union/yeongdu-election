// src/main/windows.ts
import { BrowserWindow } from 'electron'
import path from 'node:path'

const isDev = process.env.NODE_ENV === 'development'

export function createSubWindow(): BrowserWindow {
  const win = new BrowserWindow({
    width: 600,
    height: 500,
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js')
    }
  })

  if (isDev) {
    // React Router로 /sub 같은 라우트가 있다고 가정
    const url = `${process.env['ELECTRON_RENDERER_URL']}/#/title`
    win.loadURL(url)
  } else {
    // 빌드된 index.html을 /sub 라우트로 로드
    win.loadFile(path.join(__dirname, '../renderer/index.html'), {
      hash: 'title'
    })
  }

  return win
}

export function createWinnerWindow(): BrowserWindow {
  const win = new BrowserWindow({
    width: 600,
    height: 500,
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js')
    }
  })

  if (isDev) {
    // React Router로 /sub 같은 라우트가 있다고 가정
    const url = `${process.env['ELECTRON_RENDERER_URL']}/#/winner`
    win.loadURL(url)
  } else {
    // 빌드된 index.html을 /sub 라우트로 로드
    win.loadFile(path.join(__dirname, '../renderer/index.html'), {
      hash: 'winner'
    })
  }

  return win
}

export function createElectionWindow(): BrowserWindow {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js')
    }
  })

  if (isDev) {
    // React Router로 /sub 같은 라우트가 있다고 가정
    const url = `${process.env['ELECTRON_RENDERER_URL']}/#/election`
    win.loadURL(url)
  } else {
    // 빌드된 index.html을 /sub 라우트로 로드
    win.loadFile(path.join(__dirname, '../renderer/index.html'), {
      hash: 'election'
    })
  }

  return win
}
