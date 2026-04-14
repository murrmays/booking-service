import { BookingStatus } from '../../../../my-bookings/domain/models/booking-status';
import { Room } from '../../room/models/room';

export interface Booking {
  id: string;
  room: Room;
  date: string;
  startTime: string;
  endTime: string;
  status: BookingStatus;
  employeeId: string;
}
