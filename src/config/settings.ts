const settings : {
  site_title: string,
  site_toolbar: {
    zoom_out: string,
    zoom_in: string,
    default: string
  },
  tag_name: string,
  search_url: string
} = {
  site_title: '中国地图一览',
  site_toolbar: {
    zoom_out: '缩小',
    zoom_in: '放大',
    default: '默认地图'
  },
  tag_name: '标签',
  search_url: 'https://api.ownthink.com/kg/knowledge?entity=${query}'
}

export default settings
