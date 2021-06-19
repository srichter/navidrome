import { useState } from 'react'
import { useNotify, useTranslate } from 'react-admin'
import {
  FormControl,
  FormControlLabel,
  LinearProgress,
  Switch,
} from '@material-ui/core'
import { baseUrl, openInNewTab } from '../utils'

export const ScrobbleToggle = (props) => {
  const translate = useTranslate()
  const notify = useNotify()
  const [linked, setLinked] = useState(false)
  const [checkingLink, setCheckingLink] = useState(false)

  const checkResult = (success) => {
    if (success) {
      notify(translate('Last.fm successfully linked!'), 'success')
    } else {
      notify(translate('Last.fm could not be linked'), 'warning')
    }
    setLinked(success)
    setCheckingLink(false)
  }

  const toggleScrobble = () => {
    if (!linked) {
      setCheckingLink(true)
      openInNewTab(
        // '/api/lastfm/link'
        'https://www.last.fm/api/auth/?api_key=9b94a5515ea66b2da3ec03c12300327e&cb=http://localhost:4533/test.html'
      )
        .then(() => {
          fetch(baseUrl('/api/lastfm/link/status'))
            .then((response) => response.text())
            .then((response) => {
              checkResult(response === 'true')
            })
            .catch((error) => {
              checkResult(false)
              throw new Error(error)
            })
        })
        .catch(() => checkResult(false))
      return
    }
    setLinked(!linked)
  }

  return (
    <FormControl>
      <FormControlLabel
        control={
          <Switch
            id={'notifications'}
            color="primary"
            checked={linked || checkingLink}
            disabled={checkingLink}
            onChange={toggleScrobble}
          />
        }
        label={<span>{translate('Scrobble to Last.FM')}</span>}
      />
      {checkingLink && <LinearProgress />}
    </FormControl>
  )
}
