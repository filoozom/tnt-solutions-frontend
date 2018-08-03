// Dependencies
import createStore from 'unistore'

// Config
const config = {
  api: 'https://api.tnt.solutions'
}

// Functions
function getCurrentAmountOfNodes(activeNodesData) {
  return activeNodesData[activeNodesData.length - 1].nodes
}

// Exports
export const store = createStore({
  currency: 'USD',
  currencies: { fiat: ['USD'] },
  hostingFees: 5.0,
  ownNodes: 1,
  activeNodes: 0,
  activeNodesData: [],
  prices: {}
})

export const actions = store => ({
  async fetchCurrencies() {
    const response = await fetch(`${config.api}/calculator/currencies`)
    return {
      currencies: await response.json()
    }
  },
  async fetchPrice({ prices }, currency) {
    const response = await fetch(`${config.api}/calculator/price/${currency}`)
    const json = await response.json()
    return {
      prices: {
        ...prices,
        ...json
      }
    }
  },
  async fetchActiveNodes() {
    const response = await fetch(`${config.api}/calculator/active-nodes`)
    const activeNodesData = await response.json()
    return {
      activeNodes: getCurrentAmountOfNodes(activeNodesData),
      activeNodesData
    }
  },
  async setCurrency(state, currency) {
    const prices = await actions(store).fetchPrice(state, currency)
    return {
      currency,
      ...prices
    }
  },
  setPrice: ({ currency, prices }, price) => {
    return {
      prices: {
        ...prices,
        [currency]: parseFloat(price)
      }
    }
  },
  setActiveNodes: (state, activeNodes) => ({
    activeNodes: parseInt(activeNodes)
  }),
  setHostingFees: (state, hostingFees) => ({
    hostingFees: parseFloat(hostingFees)
  }),
  setOwnNodes: (state, ownNodes) => ({
    ownNodes: parseInt(ownNodes)
  })
})

store.subscribe(state => {
  localStorage.setItem('state', JSON.stringify(state))
})
