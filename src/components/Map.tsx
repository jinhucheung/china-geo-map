import React from 'react'
import echarts from 'echarts'

import { fetchData, getAreaDataUrl } from '../lib/tools'

import './Map.css'

interface MapInterface {
  chart: echarts.ECharts | null
}

interface MapProps {
  area: string[]
}

interface MapState {}

export default class Map extends React.Component<MapProps, MapState> implements MapInterface {
  chart: echarts.ECharts | null

  constructor(props: any) {
    super(props)

    this.chart = null

    this.setupChinaMap = this.setupChinaMap.bind(this)
    this.renderMap = this.renderMap.bind(this)
  }

  componentDidMount() {
    this.chart = echarts.init(document.getElementById('map-content') as HTMLDivElement)
    this.setupChinaMap()
  }

  render() {
    return (
      <div id="map-content"></div>
    )
  }

  private setupChinaMap() {
    fetchData(getAreaDataUrl(this.props.area)).then(data => {
      console.log(data)

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

  private renderMap(name: string, data: object[]) {
    console.log(this.chart)
    this.chart && this.chart.setOption({
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
              color: '#999',
              fontSize: 13
            }
          },
          emphasis: {
            show: true,
            textStyle: {
              color: '#fff',
              fontSize: 13
            }
          }
        },
        itemStyle: {
          normal: {
            areaColor: '#323c48',
            borderColor: 'dodgerblue'
          },
          emphasis: {
            areaColor: 'darkorange'
          }
        },
      }]
    })
  }
}