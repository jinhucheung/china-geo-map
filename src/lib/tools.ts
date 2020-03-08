import settings from '../config/settings'
import { MapSeriesDataObject, Area } from '../types/'
import clone from 'rfdc'

export function setDocTitle({area, title = settings.site_title} : {area?: Area, title?: string}) {
  if (!area) return document.title = title

  const parsed_area = parseArea(area)
  const cloned_area_names = clone()(parsed_area.area_names)

  cloned_area_names.shift()
  cloned_area_names.push(title)
  document.title = cloned_area_names.join(' - ')
}

export async function fetchData(url: string, option?: object) {
  const response = await fetch(url, option)
  return await response.json()
}

export function parseArea(area: Area) : {deep_area: any, area_values: (string|undefined)[], area_names: (string|undefined)[]} {
  const [deep_area_value, deep_area_level] = area.city ? [area.city, 'city'] : (area.province ? [area.province, 'province'] : [area.country, 'country'])

  return {
    deep_area: {
      ...deep_area_value,
      level: deep_area_level
    },
    area_values: [area.country?.value, area.province?.value, area.city?.value].filter(x => x),
    area_names: [area.country?.name, area.province?.name, area.city?.name].filter(x => x)
  }
}

export function getAreaDataUrl(area: Area) : string {
  let path = null
  const parsed_area = parseArea(area)

  switch(parsed_area.deep_area.level) {
    case 'province':
      path = 'provinces'
      break
    case 'city':
      path = 'cities'
      break
    default:
      path = `${parsed_area.deep_area.value||'china'}.json`
  }

  return `${window.location}/data/map/${path}`
}

const MapColors = [
  '#92779B', '#9FA9B2', '#A0C5D2', '#82B8B5', '#52A1A7',
  '#92779B', '#9FA9B2', '#A0C5D2', '#83B8E0', '#5898CF',
  '#8E6E9C', '#9CA6BD', '#A0BAD9', '#7BB1DD', '#4B95CD',
  '#978F91', '#9FADB3', '#9CC0E5', '#86A8D9', '#6982C5',
  '#737FC3', '#8BA6D8', '#9CC0E5', '#82B9C8', '#499CA4'
]

export function setMapSeriesItemColor(data: MapSeriesDataObject[]) : MapSeriesDataObject[] {
  let cloned = clone()(data)

  cloned.forEach((item, index) => {
    let colorIndex = ((index + 2 + (index << 1)) % MapColors.length) ^ 5
    if (colorIndex < 0 || colorIndex >= MapColors.length) colorIndex = index % MapColors.length

    item.itemStyle = {
      color: MapColors[colorIndex]
    }
  })

  return cloned
}