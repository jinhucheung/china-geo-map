export interface MapSeriesDataObject {
  name: string,
  value?: any,
  itemStyle?: {
    color?: string
  }
}

export interface Area {
  country?: {
    name: string,
    value: string
  },
  province?: {
    name: string,
    value: string
  },
  city?: {
    name: string,
    value: string
  }
}