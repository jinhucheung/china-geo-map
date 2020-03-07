import settings from '../config/settings'

export function setDocTitle({subtitles, title = settings.site_title} : {subtitles?: string|string[]|undefined|null, title?: string}) {
  if (!subtitles) {
    document.title = title
  } else if (subtitles instanceof String) {
    document.title = `${subtitles} - ${title}`
  } else if (subtitles instanceof Array) {
    subtitles.push(title)
    document.title = subtitles.join(' - ')
  }
}