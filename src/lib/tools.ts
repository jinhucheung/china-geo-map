import settings from '../config/settings'

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