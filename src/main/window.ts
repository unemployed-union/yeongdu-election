import { BrowserWindow, shell } from 'electron'
import { join } from 'node:path'
import { is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

type WindowPage = 'main' | 'title' | 'winner' | 'election'

const windowOptions = {
  main: { width: 900, height: 670, route: '/' },
  title: { width: 600, height: 500, route: '/title' },
  winner: { width: 600, height: 500, route: '/winner' },
  election: { width: 800, height: 600, route: '/election' }
} satisfies Record<WindowPage, { width: number; height: number; route: string }>

export function createWindow(page: WindowPage = 'main'): BrowserWindow {
  const { width, height, route } = windowOptions[page]
  const window = new BrowserWindow({
    width,
    height,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    }
  })

  window.once('ready-to-show', () => window.show())
  window.webContents.setWindowOpenHandler(({ url }) => {
    void shell.openExternal(url)
    return { action: 'deny' }
  })

  const rendererUrl = process.env['ELECTRON_RENDERER_URL']
  if (is.dev && rendererUrl) {
    const url = new URL(rendererUrl)
    url.hash = route
    void window.loadURL(url.toString())
  } else {
    void window.loadFile(join(__dirname, '../renderer/index.html'), { hash: route })
  }

  return window
}
