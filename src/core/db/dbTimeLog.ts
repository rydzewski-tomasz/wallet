import clock from '../clock';

export default {
  insertTimeLog: () => {
    const now = clock.toDb(clock.now());
    return { created: now, updated: now };
  },
  updateTimeLog: () => {
    const now = clock.toDb(clock.now());
    return { updated: now };
  }
}

