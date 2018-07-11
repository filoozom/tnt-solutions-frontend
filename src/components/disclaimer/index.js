import { h, Component } from 'preact'

import style from './style'

export default class Disclaimer extends Component {
  render() {
    return (
      <p class={style.disclaimer}>
        This is an unofficial tool and is in no way affiliated with Tierion or
        Chainpoint.
      </p>
    )
  }
}
