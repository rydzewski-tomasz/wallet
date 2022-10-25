import clock from '../clock';

export default {
  createTimeLog: () => {
    const now = clock.toDb(clock.now());
    return { created: now, updated: now };
  },
  updateTimeLog: () => {
    const now = clock.toDb(clock.now());
    return { updated: now };
  }
};
