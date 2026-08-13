import moment from 'moment'

const INPUT_FORMAT = 'DD.MM.YYYY HH:mm'
const TIME_PERIOD_RE = /^(\d{2}\.\d{2}\.\d{4} \d{2}:\d{2})-(\d{2}\.\d{2}\.\d{4} \d{2}:\d{2})$/

export function parseTimePeriod(timePeriod) {
  const match = typeof timePeriod === 'string' && timePeriod.match(TIME_PERIOD_RE)
  if (!match) return { beginDate: null, endDate: null }
  return {
    beginDate: moment(match[1], INPUT_FORMAT),
    endDate: moment(match[2], INPUT_FORMAT),
  }
}
