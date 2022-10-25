import dayjs, { Dayjs } from 'dayjs';

const defaultFormat = 'YYYY-MM-DD HH:mm:ss';

export default {
  now: () => dayjs(),
  fromDb: (input: Date) => {
    const dateTextWithoutTimezone = dayjs(input).format('YYYY-MM-DD HH:mm:ss');
    return dayjs.utc(dateTextWithoutTimezone);
  },
  toDb: (input: Dayjs) => input.format(defaultFormat)
};
