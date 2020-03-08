export interface MapSeriesDataObject {
  name: string,
  value?: string,
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
  },
  county?: {
    name: string,
    value?: string
  }
}

export interface WikiData {
  entity: string,
  desc: string,
  avp: string[][],
  tag: string[]
}