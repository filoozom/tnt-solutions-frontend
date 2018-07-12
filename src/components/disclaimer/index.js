import { h, Component } from 'preact'

import style from './style'

export default class Disclaimer extends Component {
  render() {
    return (
      <div class={style.disclaimer}>
        <p>
          This is an{' '}
          <a href="https://github.com/filoozom/tnt-solutions-frontend">
            open source tool
          </a>{' '}
          created by{' '}
          <a href="https://github.com/filoozom">Philippe Schommers</a>.
        </p>
        <p>
          Any ETH/TNT donations are welcome to
          0x74725D8Bf9c95587829e9567aA89D92DE0Ded530.
        </p>
      </div>
    )
  }
}
