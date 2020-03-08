import React from 'react'
import { setDocTitle } from '../lib/tools'
import settings from '../config/settings'

import Map from '../components/Map'

import { Area } from '../types'

import './App.css'

interface AppProps {}

interface AppState {
  area: Area
}

export default class App extends React.Component<AppProps, AppState> {
  constructor (props: any) {
    super(props)

    this.state = {
      area: {
        country: { name: '中国', value: 'china' }
      }
    }
  }

  render () {
    setDocTitle({area: this.state.area})

    return (
      <div className="app">
        <div className="app-header">
          <div className="app-header-title">{settings.site_title}</div>
        </div>
        <div className="app-main">
          <div className="app-main-content-container"></div>
          <div className="app-main-map-container"><Map area={this.state.area} /></div>
        </div>
        <div className="app-footer"></div>
      </div>
    )
  }
}