import React from 'react'
import './Wiki.css'

import settings  from '../config/settings'
import { parseArea, mergeWikiAvp } from '../lib/tools'

import { Area, WikiData } from '../types'

interface WikiProps {
  area: Area,
  data?: WikiData
}

interface WikiState {
}

export default class Wiki extends React.Component<WikiProps, WikiState> {
  render () {
    const parsed_area = parseArea(this.props.area)
    const area_ident = parsed_area.area_values.join('-')
    const avp = this.props.data?.avp && mergeWikiAvp(this.props.data.avp)

    return (
      <div className="app-wiki">
        <div className="app-wiki-title">{this.props.data?.entity}</div>
        <div className="app-wiki-desc">{this.props.data?.desc}</div>
        <div className="app-wiki-items">
          {
            avp && Object.keys(avp).map(key => {
              return (<div className="app-wiki-item" key={area_ident + ':' + key}>
                <span className="app-wiki-item-name">{key}：</span>
                <span className="app-wiki-item-value">{avp[key].join('、')}</span>
              </div>)
            })
          }
        </div>
        {
          this.props.data?.tag && this.props.data.tag.length > 0 && (
            <div className="app-wik-tags">
              <span className="app-wiki-tags-name">{settings.tag_name}：</span>
              <span className="app-wik-tags-value">{this.props.data.tag.join('、')}</span>
            </div>
          )
        }
      </div>
    )
  }
}