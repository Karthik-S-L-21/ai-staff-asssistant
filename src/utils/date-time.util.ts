import moment from 'moment';

export const currDate = (value?: string | number | Date): Date => {
  return value ? new Date(value) : new Date();
};

export const toUTC = (date: Date): Date => moment.utc(date).toDate();
