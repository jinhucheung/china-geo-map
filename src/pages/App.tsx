import React from 'react'
import clone from 'rfdc'
import Map from '../components/Map'
import Toolbar from '../components/Toolbar'
import Wiki from '../components/Wiki'

import settings from '../config/settings'
import { setDocTitle, getAreaDataUrl, fetchData } from '../lib/tools'
import { Area, WikiData } from '../types'

import './App.css'

interface AppProps {}

interface AppState {
  area: Area
  geoData?: object,
  wikiData?: WikiData|null
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

    this.fetchAreaData = this.fetchAreaData.bind(this)
    this.updateArea = this.updateArea.bind(this)
    this.zoomMap = this.zoomMap.bind(this)
  }

  componentDidMount () {
    this.fetchAreaData(this.state.area)
  }

  render () {
    setDocTitle({area: this.state.area})

    return (
      <div className="app">
        <div className="app-header">
          <div className="app-header-title">{settings.site_title}</div>
        </div>
        <div className="app-main">
          {this.state.wikiData && <div className="app-main-wiki-container"><Wiki data={this.state.wikiData} area={this.state.area} /></div>}
          <div className="app-main-map-container"><Map area={this.state.area} data={this.state.geoData} updateArea={this.updateArea} /></div>
        </div>
        <div className="app-footer">
          <Toolbar showZoomOut={!!this.state.area.city || !!this.state.area.province} zoomMap={this.zoomMap} />
        </div>
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

    if (!params.data) return

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
    } else if (data.name) {
      return this.fetchWikiData({
        ...this.state.area,
        county: data
      })
    } else {
      nextArea = {
        ...this.defaultArea
      }
    }

    this.fetchAreaData(nextArea)
  }

  private zoomMap (action: string) {
    switch (action) {
      case 'zoom_out':
        let cloned = clone()(this.state.area)
        if (cloned.city) {
          delete cloned.city
        } else if (cloned.province) {
          delete cloned.province
        }
        this.fetchAreaData(cloned)
        break
      case 'zoom_default':
        this.fetchAreaData(this.defaultArea)
        break
    }
  }

  private fetchWikiData (area: Area) {
    let query = area.county ? area.county.name : (area.city ? area.city.name : (area.province ? area.province.name : area.country?.name))

    if (!query) return

    // Fixme: ownthink 市级搜索兼容
    if (!area.county && !area.city && area.province) query = query.replace(/市$/, '')

    const query_url = settings.search_url.replace('${query}', encodeURIComponent(query))

    fetchData(query_url)
      .then(data => {
        if (data.message === 'success') {
          this.setState({wikiData: data.data})
        } else {
          this.setState({wikiData: null})
        }
      })
  }

  private fetchAreaData (area: Area) {
    this.fetchGeoData(area)
    this.fetchWikiData(area)
  }
}