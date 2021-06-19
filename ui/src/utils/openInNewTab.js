export const openInNewTab = (url) => {
  const win = window.open(url, '_blank')
  win.focus()
  return new Promise((resolve, reject) => {
    const timeout = window.setTimeout(() => reject(), 30000)
    const handleMessage = (event) => {
      if (
        window.origin === event.origin &&
        event.data === 'lastfm-link-complete'
      ) {
        window.clearTimeout(timeout)
        resolve()
      }
    }
    window.addEventListener('message', handleMessage)
  })
}
