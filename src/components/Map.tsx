import React from 'react'
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/map'
import 'echarts/lib/component/tooltip'

import { MapSeriesDataObject, Area } from '../types'
import { fetchData, getAreaDataUrl, setMapSeriesItemColor } from '../lib/tools'

import './Map.css'

interface MapInterface {
  chart: echarts.ECharts | null
}

interface MapProps {
  area: Area
}

interface MapState {}

export default class Map extends React.Component<MapProps, MapState> implements MapInterface {
  chart: echarts.ECharts | null

  constructor(props: any) {
    super(props)

    this.chart = null

    this.setupChinaMap = this.setupChinaMap.bind(this)
    this.renderMap = this.renderMap.bind(this)
    this.resizeMap = this.resizeMap.bind(this)
  }

  componentDidMount() {
    this.chart = echarts.init(document.getElementById('map-content') as HTMLDivElement)
    this.setupChinaMap()
    window.addEventListener('resize', this.resizeMap)
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.resizeMap)
  }

  render() {
    return (
      <div id="map-content"></div>
    )
  }

  private setupChinaMap() {
    fetchData(getAreaDataUrl(this.props.area)).then(data => {
      const features = data.features && data.features.map((feature: any) => {
        return {name: feature.properties.name}
      })

      this.registerMap('china', data)
      this.renderMap('china', features)
    })
  }

  private registerMap(name: string, data: object) {
    echarts.registerMap(name, data)
  }

  private renderMap(name: string, data: MapSeriesDataObject[]) {
    data = setMapSeriesItemColor(data)

    this.chart?.setOption({
      tooltip: {
        trigger: 'item',
        formatter: '{b}'
      },
      toolbox: {
        show: true,
        orient: 'vertical',
        left: 'right',
        top: 'center',
        feature: {
          dataView: { readOnly: false },
          restore: {},
          saveAsImage: {}
        },
        iconStyle: {
          normal: {
            color: '#fff'
          }
        }
      },
      animationDuration: 1000,
      animationEasing: 'cubicOut',
      animationDurationUpdate: 1000,
      series: [{
        name: name,
        type: 'map',
        roam: false,
        map: 'china',
        data: data,
        label: {
          normal: {
            show: true,
            textStyle: {
              color: '#666',
              fontSize: 13
            }
          },
          emphasis: {
            show: true,
            textStyle: {
              color: '#969696',
              fontSize: 13
            }
          }
        }
      }]
    })
  }

  private resizeMap() {
    this.chart?.resize()
  }
}