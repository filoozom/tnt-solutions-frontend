// Dependencies
import { h, Component } from 'preact'
import { connect } from 'unistore/preact'

// Store
import { actions } from '../../store'

// Material
import Button from 'preact-material-components/Button'
import Menu from 'preact-material-components/Menu'
import Toolbar from 'preact-material-components/Toolbar'

import 'preact-material-components/Button/style.css'
import 'preact-material-components/List/style.css'
import 'preact-material-components/Menu/style.css'
import 'preact-material-components/Toolbar/style.css'

// Style
import style from './style'

@connect(
  ['currencies', 'currency'],
  actions
)
export default class Header extends Component {
  componentDidMount() {
    this.props.fetchCurrencies()
  }

  render({ currencies, currency, setCurrency }) {
    return (
      <div>
        <Toolbar className="toolbar">
          <Toolbar.Row>
            <Toolbar.Section align-start>
              <Toolbar.Title>Chainpoint Node Calculator</Toolbar.Title>
            </Toolbar.Section>
            <Toolbar.Section align-end className={style['toolbar-right']}>
              <Menu.Anchor>
                <Button
                  onClick={e => {
                    this.menu.MDComponent.open = true
                  }}
                >
                  {currency}
                </Button>
                <Menu
                  ref={menu => {
                    this.menu = menu
                  }}
                >
                  {((currencies || {}).fiat || []).map(currency => {
                    return (
                      <Menu.Item onClick={setCurrency.bind(null, currency)}>
                        {currency}
                      </Menu.Item>
                    )
                  })}
                </Menu>
              </Menu.Anchor>
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
