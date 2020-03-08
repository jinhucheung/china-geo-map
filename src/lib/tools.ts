import settings from '../config/settings'
import { mapColors, provinceMaps } from './variables'
import { MapSeriesDataObject, Area } from '../types/'
import clone from 'rfdc'

export function setDocTitle({area, title = settings.site_title} : {area?: Area, title?: string}) {
  if (!area) return document.title = title

  const parsed_area = parseArea(area)
  const cloned_area_names = clone()(parsed_area.area_names)

  cloned_area_names.shift()
  cloned_area_names.reverse()
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
      path = `provinces/${provinceMaps[parsed_area.deep_area.name]}`
      break
    case 'city':
      path = `cities/${parsed_area.deep_area.value}`
      break
    default:
      path = `${parsed_area.deep_area.value||'china'}`
  }

  return `${window.location}/data/map/${path}.json`
}

export function extractMapSeries(data: {features?: object[]}) : MapSeriesDataObject[] {
  let features = clone()(data.features) || []

  return features.map((item: any, index: number) => {
    const colorIndex = ((index + 2 + (index << 1)) % mapColors.length) ^ 5

    return {
      name: item.properties.name,
      value: item.id,
      itemStyle: {
        color: mapColors[colorIndex] || mapColors[index % mapColors.length]
      }
    }
  })
}

export function mergeWikiAvp (avp: string[][]) : {[index: string]: string[]} {
  let result : {[index: string]: string[]} = {}

  avp.forEach(item => {
    const key = item[0]
    result[key] = result[key] || []
    result[key].push(item[1])
  })

  return result
}