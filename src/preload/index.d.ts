import type { ElectionApi } from '../shared/election'

declare global {
  interface Window {
    api: ElectionApi
  }
}
