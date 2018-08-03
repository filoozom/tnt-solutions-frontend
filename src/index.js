// Dependencies
import { h, Component } from 'preact'
import { Provider } from 'unistore/preact'

// Store
import { store } from './store'

// Components
import App from './components/app'

// Style
import './style'

export default class Index extends Component {
  componentDidMount() {
    store.setState(JSON.parse(localStorage.getItem('state')))
  }

  render() {
    return (
      <Provider store={store}>
        <App />
      </Provider>
    )
  }
}
