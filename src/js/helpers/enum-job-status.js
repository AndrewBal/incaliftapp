export const JOB_STATUS = {
  SCHEDULED: 1,
  COMPLETE: 2,
  OVERDUE: 3,
  DELETED: 4,
  CANCELED: 5,
  IN_PROGRESS: 6,
  HOLD: 7,
}

const statuses = {
  1: { text: 'Scheduled', color: 'red' },
  2: { text: 'Completed', color: 'green' },
  3: { text: 'Overdue', color: 'red' },
  4: { text: 'Deleted', color: 'darkgray' },
  5: { text: 'Cancelled', color: 'darkgray' },
  6: { text: 'In Process', color: 'orange' },
  7: { text: 'On Hold', color: 'orange' },
}

// Overdue/Canceled/Deleted (and any other status) are only meaningful in the agent portal
export const VISIBLE_JOB_STATUSES = [JOB_STATUS.COMPLETE, JOB_STATUS.IN_PROGRESS, JOB_STATUS.HOLD, JOB_STATUS.SCHEDULED]

export function isJobVisible(code) {
  return VISIBLE_JOB_STATUSES.includes(code) || !statuses[code]
}

export function getJobStatus(code) {
  return statuses[code] || { text: 'New', color: 'green' }
}

export default statuses
