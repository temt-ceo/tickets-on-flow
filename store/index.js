export const state = () => ({
  tickets: []
})

export const mutations = {
  updateTickets (state, value) {
    state.tickets = value
  }
}
