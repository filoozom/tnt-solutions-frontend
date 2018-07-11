import { h, Component } from 'preact'
import Toolbar from 'preact-material-components/Toolbar'

import 'preact-material-components/Toolbar/style.css'
import style from './style'

export default class Header extends Component {
  render() {
    return (
      <div>
        <Toolbar className="toolbar">
          <Toolbar.Row>
            <Toolbar.Section align-start>
              <Toolbar.Title>Tierion calculator</Toolbar.Title>
            </Toolbar.Section>
            <Toolbar.Section align-end className={style['toolbar-right']}>
              <a href="https://github.com/filoozom/tnt-solutions-frontend">
                <img src="/assets/icons/github.png" />
              </a>
            </Toolbar.Section>
          </Toolbar.Row>
        </Toolbar>
      </div>
    )
  }
}
