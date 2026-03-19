import {
  MOCK_SUPPORT_TICKETS,
  SUPPORT_TICKET_PRIORITY_STYLES,
  SUPPORT_TICKET_STATUS_STYLES,
} from '../../data/mockApiData'
import { resolveMock } from './utils'

export async function getCustomerServiceTickets() {
  return resolveMock(MOCK_SUPPORT_TICKETS)
}

export async function getCustomerServiceFilters() {
  const tickets = await getCustomerServiceTickets()

  return {
    statuses: ['Tous statuts', ...new Set(tickets.map(ticket => ticket.status))],
    categories: ['Toutes catégories', ...new Set(tickets.map(ticket => ticket.category))],
    priorities: ['Toutes priorités', ...new Set(tickets.map(ticket => ticket.priority))],
  }
}

export function getSupportTicketPriorityStyles() {
  return SUPPORT_TICKET_PRIORITY_STYLES
}

export function getSupportTicketStatusStyles() {
  return SUPPORT_TICKET_STATUS_STYLES
}
