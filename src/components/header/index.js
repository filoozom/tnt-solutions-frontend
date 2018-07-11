import { h, Component } from 'preact'
import Toolbar from 'preact-material-components/Toolbar'

import 'preact-material-components/Toolbar/style.css'

export default class Header extends Component {
  render() {
    return (
      <div>
        <Toolbar className="toolbar">
          <Toolbar.Row>
            <Toolbar.Section align-start>
              <Toolbar.Title>Tierion calculator</Toolbar.Title>
            </Toolbar.Section>
          </Toolbar.Row>
        </Toolbar>
      </div>
    )
  }
}
