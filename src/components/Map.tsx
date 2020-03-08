import React from 'react'
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/map'
import 'echarts/lib/component/tooltip'

import { Area } from '../types'
import { parseArea, extractMapSeries } from '../lib/tools'

import './Map.css'

interface MapInterface {
  chart: echarts.ECharts | null
}

interface MapProps {
  area: Area,
  data?: object,
  updateArea: Function
}

interface MapState {}

export default class Map extends React.Component<MapProps, MapState> implements MapInterface {
  chart: echarts.ECharts | null

  constructor(props: any) {
    super(props)

    this.chart = null

    this.renderMap = this.renderMap.bind(this)
    this.resizeMap = this.resizeMap.bind(this)
  }

  componentDidMount() {
    this.chart = echarts.init(document.getElementById('map-content') as HTMLDivElement)
    window.addEventListener('resize', this.resizeMap)
    this.chart.on('click', this.props.updateArea)
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.resizeMap)
  }

  render() {
    return (
      <div id="map-content"></div>
    )
  }

  componentDidUpdate (prevProps: MapProps) {
    if ((prevProps.area !== this.props.area || prevProps.data !== this.props.data) && this.props.area && this.props.data) {
      const area_ident = parseArea(this.props.area).area_values.join('-')
      this.registerMap(area_ident, this.props.data)
      this.renderMap(area_ident, this.props.data)
    }
  }

  private registerMap(name: string, data: object) {
    echarts.registerMap(name, data)
  }

  private renderMap(name: string, data: {features?: object[]}) {
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
        map: name,
        data: extractMapSeries(data),
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