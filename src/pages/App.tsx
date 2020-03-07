import React from 'react'
import { setDocTitle } from '../lib/tools'
import './App.css'

interface AppProps {}

interface AppState {
  area: string|undefined|null
}

export default class App extends React.Component<AppProps, AppState> {
  constructor (props: any) {
    super(props)

    this.state = {
      area: null
    }
  }

  render () {
    setDocTitle({subtitles: this.state.area})

    return (
      <div>
        Hello World
      </div>
    )
  }
}