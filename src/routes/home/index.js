import { h, Component } from 'preact'
import linkState from 'linkstate'
import LayoutGrid from 'preact-material-components/LayoutGrid'
import Snackbar from 'preact-material-components/Snackbar'
import TextField from 'preact-material-components/TextField'

import 'preact-material-components/LayoutGrid/style.css'
import 'preact-material-components/Snackbar/style.css'
import 'preact-material-components/TextField/style.css'
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

export default class Home extends Component {
  leftAxisDimension = [0, 0]

  componentDidMount() {
    this.setState({
      fees: localStorage.getItem('fees') || 5.0,
      nodes: localStorage.getItem('nodes'),
      tntPrice: localStorage.getItem('tntPrice'),
      graphData: JSON.parse(localStorage.getItem('graphData') || '[]')
    })

    fetch('https://api.tnt.solutions/calculator')
      .then(response => {
        response.json().then(data => {
          this.setState({
            ...data,
            nodes: this.getCurrentAmountOfNodes(data.graphData)
          })
        })
      })
      .catch(() => {
        this.snackBar.MDComponent.show({
          message:
            'An error occured while contacting the server. Using cached data if available.'
        })
      })
  }

  setState(data) {
    for (let element in data) {
      let value = data[element]
      if (typeof data[element] === 'object') {
        value = JSON.stringify(value)
      }
      localStorage.setItem(element, value)
    }
    super.setState(data)
  }

  getGraphData() {
    if (!this.state.graphData) {
      return []
    }

    return this.state.graphData.map(value => ({
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
    super.setState({
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
    let months = (this.getRewardDays(this.state.nodes) / 365) * 12
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

  getCurrentAmountOfNodes(graphData) {
    graphData = graphData || this.state.graphData
    return graphData[graphData.length - 1].nodes
  }

  getRewardValue(withFees = false) {
    let price = 1500 * this.state.tntPrice

    if (withFees) {
      price -= this.getRewardMonths(true) * this.state.fees
    }

    return this.roundPrice(price)
  }

  getMonthlyProfit() {
    return this.roundPrice(this.getRewardValue(true) / this.getRewardMonths())
  }

  render({}, { rightAxisDomain, nodes, fees, tntPrice }) {
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
                label="TNT price"
                type="number"
                step="0.000001"
                value={tntPrice}
                onInput={linkState(this, 'tntPrice')}
              />
              <TextField
                label="Amount of nodes"
                type="number"
                step="1"
                value={nodes}
                onInput={linkState(this, 'nodes')}
              />
              <TextField
                label="Hosting fees per month (USD)"
                type="number"
                step="0.01"
                value={fees}
                onInput={linkState(this, 'fees')}
              />

              <div style={{ 'margin-top': '20px' }}>
                <TextField
                  disabled={true}
                  label="Time before reward *"
                  value={`${this.getRewardDays(nodes)} days`}
                />
                <TextField
                  disabled={true}
                  label="Expected income *"
                  value={this.getRewardValue()}
                />
                <TextField
                  disabled={true}
                  label="Expected profit *"
                  value={this.getRewardValue(true)}
                />
                <TextField
                  disabled={true}
                  label="Monthly profit *"
                  value={this.getMonthlyProfit()}
                />
                <p>* All those values only apply for the first reward</p>
              </div>
            </LayoutGrid.Cell>
            <LayoutGrid.Cell
              cols="8"
              phoneCols="4"
              tabletCols="8"
              align="middle"
            >
              <div style={{ 'margin-top': '20px' }}>
                <ResponsiveContainer height={400}>
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
