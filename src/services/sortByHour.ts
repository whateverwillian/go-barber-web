import { Appointment } from '../pages/Dashboard/index';

// Sort the appointments array based on the hour
export default (appointments: Appointment[]): Appointment[] => {
  return appointments.sort((a, b) => {
    if (a.hour < b.hour) return -1;
    if (b.hour > a.hour) return 1;

    return 0;
  });
};
