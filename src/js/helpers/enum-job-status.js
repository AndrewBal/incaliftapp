export const JOB_STATUS = {
  OVERDUE: 1,
  COMPLETE: 2,
  CANCELED: 5,
  IN_PROGRESS: 6,
  HOLD: 7,
  SCHEDULED: 8,
}

const statuses = {
  1: { text: 'Overdue', color: 'red' },
  2: { text: 'Complete', color: 'green' },
  5: { text: 'Canceled', color: 'darkgray' },
  6: { text: 'In Progress', color: 'blue' },
  7: { text: 'Hold', color: 'orange' },
  8: { text: 'Scheduled', color: 'red' },
}

// Overdue/Canceled (and any other status) are only meaningful in the agent portal
export const VISIBLE_JOB_STATUSES = [JOB_STATUS.COMPLETE, JOB_STATUS.IN_PROGRESS, JOB_STATUS.HOLD, JOB_STATUS.SCHEDULED]

export function isJobVisible(code) {
  return VISIBLE_JOB_STATUSES.includes(code)
}

export function getJobStatus(code) {
  return statuses[code] || { text: `Status ${code}`, color: 'lightgray' }
}

export default statuses
