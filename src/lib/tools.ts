import settings from '../config/settings'
import { MapSeriesDataObject } from '../types/index'
import clone from 'rfdc'

export function setDocTitle({subtitles, title = settings.site_title} : {subtitles?: string|string[]|undefined|null, title?: string}) {
  if (!subtitles) {
    document.title = title
  } else if (subtitles instanceof String) {
    document.title = `${subtitles} - ${title}`
  } else if (subtitles instanceof Array) {
    document.title = `${subtitles.join(' - ')} - ${title}`
  }
}

export async function fetchData(url: string, option?: object) {
  const response = await fetch(url, option)
  return await response.json()
}

export function parseArea(area: string[]) : {country: string, province: string|undefined, city: string|undefined, current_level: string, current_value: string} {
  const [country, province, city] = area

  return {
    country: country,
    province: province,
    city: city,
    current_level: city ? 'city' : (province ? 'province' : 'country'),
    current_value: city ? city : (province ? province : country),
  }
}

export function getAreaDataUrl(area: string[]) : string {
  let path = null
  const parsed_area = parseArea(area)

  switch(parsed_area.current_level) {
    case 'province':
      path = 'provinces'
      break
    case 'city':
      path = 'cities'
      break
    default:
      path = `${parsed_area.current_value||'china'}.json`
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

    console.log(item.name + '  ' + MapColors[colorIndex])
  })

  return cloned
}