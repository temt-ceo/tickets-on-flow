export const state = () => ({
  tickets: [],
  ticketTime: {}
})

export const mutations = {
  updateTickets (state, value) {
    state.tickets = value
  },
  updateTicketTime (state, value) {
    state.ticketTime = value
  }
}
