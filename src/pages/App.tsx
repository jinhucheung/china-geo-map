import React from 'react'
import Map from '../components/Map'

import settings from '../config/settings'
import { setDocTitle, getAreaDataUrl, fetchData } from '../lib/tools'
import { Area } from '../types'

import './App.css'

interface AppProps {}

interface AppState {
  area: Area
  geoData?: object
}

export default class App extends React.Component<AppProps, AppState> {
  defaultArea = {
    country: { name: '中国', value: 'china' }
  }

  constructor (props: any) {
    super(props)

    this.state = {
      area: this.defaultArea
    }

    this.fetchGeoData = this.fetchGeoData.bind(this)
    this.updateArea = this.updateArea.bind(this)
  }

  componentDidMount () {
    this.fetchGeoData(this.state.area)
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
          <div className="app-main-map-container"><Map area={this.state.area} data={this.state.geoData} updateArea={this.updateArea} /></div>
        </div>
        <div className="app-footer"></div>
      </div>
    )
  }

  private fetchGeoData (area: Area) {
    fetchData(getAreaDataUrl(area))
      .then(data => {
        this.setState({geoData: data, area: area})
      })
      .catch(err => {
        console.error(err)
      })
  }

  private updateArea (params: any) {
    const currentArea = this.state.area
    let nextArea: Area = {}

    let [country, province, city] = (params.seriesName || '').split('-')

    let data = {
      name: params.data.name,
      value: params.data.value
    }

    if (!country || country !== currentArea.country?.value) {
      nextArea.country = data
    } else if (!province || province !== currentArea.province?.value) {
      nextArea = {
        country: currentArea.country,
        province: data
      }
    } else if (!city || city !== currentArea.city?.value) {
      nextArea = {
        country: currentArea.country,
        province: currentArea.province,
        city: data
      }
    } else {
      nextArea = {
        ...this.defaultArea
      }
    }

    this.fetchGeoData(nextArea)
  }
}