import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { createWinnerWindow, createSubWindow, createElectionWindow } from './window'
import { appState } from './data'

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  ipcMain.handle('open-sub-window', () => {
    createSubWindow()
  })
  ipcMain.handle('open-winner-window', () => {
    createWinnerWindow()
  })
  ipcMain.handle('open-election-window', () => {
    createElectionWindow()
  })
  ipcMain.handle('get-election-title', () => {
    return appState.title
  })
  ipcMain.handle('set-election-title', (_, title: string) => {
    appState.title = title

    BrowserWindow.getAllWindows().forEach((win) => {
      win.webContents.send('title-updated', appState.title)
    })

    return appState.title
  })
  ipcMain.handle('set-winner', (_event, winner: Record<string, string>[]) => {
    appState.winner = winner

    BrowserWindow.getAllWindows().forEach((win) => {
      win.webContents.send('winner-updated', appState.winner)
    })

    return appState.winner
  })
  ipcMain.handle('add-winner', (_event, winner: Record<string, string>) => {
    appState.winner.push(winner)

    BrowserWindow.getAllWindows().forEach((win) => {
      win.webContents.send('winner-updated', appState.winner)
    })

    return appState.winner
  })
  ipcMain.handle('vote-candidate', (_event, candidateId: string) => {
    if (!(candidateId in appState.candidate)) {
      appState.candidate[candidateId] = 0 // 새 후보도 자동 추가하고 싶다면
    } else {
      appState.candidate[candidateId] += 1
    }

    // 모든 창에 브로드캐스트 (차트 실시간 반영용)
    BrowserWindow.getAllWindows().forEach((win) => {
      win.webContents.send('vote-updated', appState.candidate)
    })

    return appState.candidate
  })
  ipcMain.handle('get-candidate', () => {
    return appState.candidate
  })
  ipcMain.handle('remove-candidate', (_event, candidateId: string) => {
    delete appState.candidate[candidateId]

    // 모든 창에 브로드캐스트 (차트 실시간 반영용)
    BrowserWindow.getAllWindows().forEach((win) => {
      win.webContents.send('vote-updated', appState.candidate)
    })

    return appState.candidate
  })
  ipcMain.handle('remove-all-candidate', (_event) => {
    appState.candidate = {}

    // 모든 창에 브로드캐스트 (차트 실시간 반영용)
    BrowserWindow.getAllWindows().forEach((win) => {
      win.webContents.send('vote-updated', appState.candidate)
    })

    return appState.candidate
  })
  ipcMain.handle('remove-winner', (_event, name: string) => {
    appState.winner = appState.winner.filter((person) => person.name !== name)

    // 모든 창에 브로드캐스트 (차트 실시간 반영용)
    BrowserWindow.getAllWindows().forEach((win) => {
      win.webContents.send('winner-updated', appState.winner)
    })

    console.log(appState.winner)

    return appState.winner
  })
  ipcMain.handle('remove-vote', (_event, candidateId: string) => {
    if (candidateId in appState.candidate && appState.candidate[candidateId] > 0) {
      appState.candidate[candidateId] -= 1
    }

    // 모든 창에 브로드캐스트 (차트 실시간 반영용)
    BrowserWindow.getAllWindows().forEach((win) => {
      win.webContents.send('vote-updated', appState.candidate)
    })

    return appState.candidate
  })
  ipcMain.handle('get-winner', () => {
    return appState.winner
  })

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
