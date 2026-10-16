/**
 * Mock account data: support tickets.
 */
import { hoursAgo } from "./dates";

export const TICKETS = [
  { id: "tkt-1001", subject: "Pheromone trap sensor offline in Plot B-03", status: "InProgress", createdAt: hoursAgo(30) },
];
