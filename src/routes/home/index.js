// Dependencies
import { h, Component } from 'preact'
import { connect } from 'unistore/preact'

// Store
import { actions } from '../../store'

// Material
import LayoutGrid from 'preact-material-components/LayoutGrid'
import Snackbar from 'preact-material-components/Snackbar'
import TextField from 'preact-material-components/TextField'

import 'preact-material-components/LayoutGrid/style.css'
import 'preact-material-components/Snackbar/style.css'
import 'preact-material-components/TextField/style.css'

// Style
import style from './style'

import {
  XAxis,
  YAxis,
  LineChart,
  Tooltip,
  CartesianGrid,
  Line,
  ResponsiveContainer
} from 'recharts'

@connect(
  [
    'activeNodes',
    'activeNodesData',
    'currency',
    'hostingFees',
    'ownNodes',
    'prices'
  ],
  actions
)
export default class Home extends Component {
  leftAxisDimension = [0, 0]

  componentDidMount() {
    this.props.fetchPrice(this.props.currency)
    this.props.fetchActiveNodes()
  }

  getGraphData() {
    return this.props.activeNodesData.map(value => ({
      ...value,
      reward: this.getRewardDays(value.nodes)
    }))
  }

  setLeftAxisRef(ref) {
    const niceTicks = ref.props.niceTicks
    const leftAxisDimension = [niceTicks[0], niceTicks[niceTicks.length - 1]]

    if (
      leftAxisDimension.every(
        (value, index) => value === this.leftAxisDimension[index]
      )
    ) {
      return
    }

    this.leftAxisDimension = leftAxisDimension
    this.setState({
      rightAxisDomain: [
        this.getRewardDays(this.leftAxisDimension[0]),
        this.getRewardDays(this.leftAxisDimension[1])
      ]
    })
  }

  getRewardDays(nodes) {
    return this.roundPrice(nodes / 48)
  }

  roundPrice(price) {
    return Math.round(100 * price) / 100
  }

  getRewardMonths(ceil = false) {
    let months = (this.getRewardDays(this.props.activeNodes) / 365) * 12
    return ceil ? Math.ceil(months) : months
  }

  formatTickDate(date) {
    if (!date) {
      return
    }

    date = new Date(date)

    return [date.getDate(), date.getMonth() + 1]
      .map(value => new String(value).padStart(2, '0'))
      .join('/')
  }

  getRewardValue(withFees = false) {
    let price = 1500 * this.getPrice()

    if (withFees) {
      price -= this.getRewardMonths(true) * this.props.hostingFees
    }

    return this.roundPrice(this.props.ownNodes * price)
  }

  getMonthlyProfit() {
    return this.roundPrice(this.getRewardValue(true) / this.getRewardMonths())
  }

  getPrice() {
    return this.props.prices[this.props.currency]
  }

  render(
    {
      activeNodes,
      currency,
      hostingFees,
      ownNodes,
      setActiveNodes,
      setHostingFees,
      setOwnNodes,
      setPrice
    },
    { rightAxisDomain }
  ) {
    return (
      <div class={style.home}>
        <LayoutGrid>
          <LayoutGrid.Inner>
            <LayoutGrid.Cell
              cols="4"
              phoneCols="4"
              tabletCols="8"
              align="middle"
            >
              <TextField
                label={`TNT price (${currency})`}
                type="number"
                step="0.0000000001"
                value={this.getPrice()}
                onInput={event => setPrice(event.target.value)}
              />
              <TextField
                label="Active nodes"
                type="number"
                step="1"
                value={activeNodes}
                onInput={event => setActiveNodes(event.target.value)}
              />

              <div style={{ 'margin-top': '20px' }}>
                <TextField
                  label={`Hosting fees per month (${currency})`}
                  type="number"
                  step="0.01"
                  value={hostingFees}
                  onInput={event => setHostingFees(event.target.value)}
                />
                <TextField
                  label="Your number of nodes"
                  type="number"
                  step="1"
                  value={ownNodes}
                  onInput={event => setOwnNodes(event.target.value)}
                />
              </div>

              <div style={{ 'margin-top': '20px' }}>
                <TextField
                  disabled={true}
                  label="Estimated time to reward *"
                  value={`${this.getRewardDays(activeNodes)} days`}
                />
                <TextField
                  disabled={true}
                  label={`Node stacking value (${currency})`}
                  value={this.roundPrice(ownNodes * 5000 * this.getPrice())}
                />
                <TextField
                  disabled={true}
                  label={`Estimated reward value (${currency}) *`}
                  value={this.getRewardValue()}
                />
                <TextField
                  disabled={true}
                  label={`Estimated profit (${currency}) *`}
                  value={this.getRewardValue(true)}
                />
                <TextField
                  disabled={true}
                  label={`Monthly profit (${currency}) *`}
                  value={this.getMonthlyProfit()}
                />
                <p class="text-center">
                  * Only applies for the first reward, assumed to be 1500 TNT
                </p>
              </div>
            </LayoutGrid.Cell>
            <LayoutGrid.Cell
              cols="8"
              phoneCols="4"
              tabletCols="8"
              align="middle"
            >
              <div style={{ 'margin-top': '20px' }}>
                <ResponsiveContainer height={500}>
                  <LineChart
                    data={this.getGraphData()}
                    margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
                  >
                    <XAxis
                      dataKey="name"
                      minTickGap={parseInt(this.getGraphData().length / 5)}
                      tickFormatter={this.formatTickDate}
                    />
                    <YAxis
                      domain={['auto', 'auto']}
                      yAxisId="left"
                      ref={this.setLeftAxisRef.bind(this)}
                    />
                    <YAxis
                      domain={rightAxisDomain}
                      yAxisId="right"
                      orientation="right"
                      unit=" days"
                    />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="nodes"
                      stroke="#8884d8"
                      dot={false}
                      yAxisId="left"
                    />
                    <Line
                      id="reward"
                      type="monotone"
                      dataKey="reward"
                      stroke="#8884d8"
                      dot={false}
                      yAxisId="right"
                      unit=" days"
                      strokeWidth={0}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </LayoutGrid.Cell>
          </LayoutGrid.Inner>
        </LayoutGrid>
        <Snackbar
          ref={bar => {
            this.snackBar = bar
          }}
        />
      </div>
    )
  }
}
