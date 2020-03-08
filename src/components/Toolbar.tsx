import React from 'react'
import settings from '../config/settings'
import './Toolbar.css'

interface ToolbarProps {
  showZoomOut: boolean,
  zoomMap: Function
}

interface ToolbarState {}

export default class Toolbar extends React.Component<ToolbarProps, ToolbarState> {

  render () {
    return (
      <div className="app-toolbar">
        {/* <i className="iconfont icon-fangda app-toolbar-item" title={settings.site_toolbar.zoom_in} onClick={() => this.props.zoomMap('zoom_in')}></i> */}
        {
          this.props.showZoomOut && <i className="iconfont icon-suoxiao app-toolbar-item" title={settings.site_toolbar.zoom_out} onClick={() => this.props.zoomMap('zoom_out')}></i>
        }
        {
          this.props.showZoomOut && <i className="iconfont icon-ditu app-toolbar-item" title={settings.site_toolbar.default} onClick={() => this.props.zoomMap('zoom_default')}></i>
        }
      </div>
    )
  }
}