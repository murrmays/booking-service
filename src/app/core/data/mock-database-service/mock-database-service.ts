import { Component, inject } from '@angular/core';
import { delay, map, Observable, of } from 'rxjs';
import { Booking } from '../../../features/book-room/domain/booking/models/booking';
import { Room } from '../../../features/book-room/domain/room/models/room';
import { BookingDraft } from '../../../features/book-room/domain/booking/models/booking-draft';
import { RoomFilter } from '../../../features/book-room/domain/room/models/room-filter';
import { User } from '../../domain/models/user';
import { AuthService } from '../auth-service/auth-service';
import { BookingStatus } from '../../../features/my-bookings/domain/models/booking-status';

@Component({
  selector: 'app-mock-database-service',
  imports: [],
  templateUrl: './mock-database-service.html',
  styleUrl: './mock-database-service.css',
})
export class MockDatabaseService {
  private readonly room_key = 'app-rooms';
  private readonly booking_key = 'app-bookings';
  private readonly users_key = 'app-all-users';

  constructor() {
    this.seedDatabase();
  }

  getRooms(): Observable<Room[]> {
    const rooms = this.readFromStorage<Room[]>(this.room_key);
    return of(rooms).pipe(delay(500));
  }
  getRoomById(id: string): Observable<Room | undefined> {
    this.updateExpiredBookings();
    const room = this.readFromStorage<Room[]>(this.room_key).find((r) => r.id === id);
    return of(room).pipe(delay(200));
  }
  searchRooms(filter: RoomFilter): Observable<Room[]> {
    const allRooms = this.readFromStorage<Room[]>(this.room_key);
    const allBookings = this.readFromStorage<Booking[]>(this.booking_key);

    const bookingsToday = allBookings.filter((b) => b.date === filter.date);

    const availableRooms = allRooms.filter((room) => {
      if (filter.minCapacity && room.capacity < filter.minCapacity) {
        return false;
      }

      if (
        filter.equipSearch &&
        typeof filter.equipSearch === 'string' &&
        filter.equipSearch.length > 0
      ) {
        const search = filter.equipSearch.toLowerCase();
        const hasMatch = room.equipment.some((item) => item.toLowerCase().includes(search));
        if (!hasMatch) return false;
      }
      const isOccupied = bookingsToday.some((booking) => {
        const isSameRoom = booking.room.id === room.id;

        const hasTimeOverlap = this.isTimeOverlapping(
          filter.startTime,
          filter.endTime,
          booking.startTime,
          booking.endTime,
        );

        return isSameRoom && hasTimeOverlap;
      });

      return !isOccupied;
    });

    return of(availableRooms).pipe(delay(500));
  }
  getBookings(): Observable<Booking[]> {
    this.updateExpiredBookings();
    const bookings = this.readFromStorage<Booking[]>(this.booking_key);
    return of(bookings).pipe(delay(500));
  }
  getBookingById(id: string): Observable<Booking | undefined> {
    this.updateExpiredBookings();
    const booking = this.readFromStorage<Booking[]>(this.booking_key).find((b) => b.id === id);
    return of(booking).pipe(delay(200));
  }
  getBookingsByUserId(id: string): Observable<Booking[]> {
    this.updateExpiredBookings();
    const allBookings = this.readFromStorage<Booking[]>(this.booking_key);
    const myBookings = allBookings.filter((b) => b.employeeId === id);
    return of(myBookings).pipe(delay(200));
  }
  createBooking(draft: BookingDraft, userId: string, room: Room): Observable<Booking> {
    const bookings = this.readFromStorage<Booking[]>(this.booking_key);

    const newBooking: Booking = {
      ...draft,
      room: room,
      id: crypto.randomUUID(),
      status: 'активна',
      employeeId: userId,
    };
    bookings.push(newBooking);
    this.saveToStorage(this.booking_key, bookings);
    return of(newBooking).pipe(delay(500));
  }
  setBookingStatus(id: string, status: BookingStatus): Observable<Booking | undefined> {
    const allBookings = this.readFromStorage<Booking[]>(this.booking_key);
    const bookingIndex = allBookings.findIndex((b) => b.id === id);

    if (bookingIndex === -1) {
      return of(undefined).pipe(delay(300));
    }

    const originalBooking = allBookings[bookingIndex];
    const updatedBooking: Booking = {
      ...originalBooking,
      status: status,
    };

    const updatedBookings = [
      ...allBookings.slice(0, bookingIndex),
      updatedBooking,
      ...allBookings.slice(bookingIndex + 1),
    ];

    this.saveToStorage(this.booking_key, updatedBookings);

    return of(updatedBooking).pipe(delay(400));
  }
  getUsers(): Observable<User[]> {
    const users = this.readFromStorage<User[]>(this.users_key);
    return of(users).pipe(delay(200));
  }
  checkTimeOverlap(
    roomId: string,
    date: string,
    startTime: string,
    endTime: string,
  ): Observable<boolean> {
    const bookings = this.readFromStorage<Booking[]>(this.booking_key);

    const isOverlaped = bookings.some(
      (b) =>
        b.room.id == roomId && b.date === date && startTime < b.endTime && endTime > b.startTime,
    );

    return of(isOverlaped).pipe(delay(200));
  }

  private readFromStorage<T>(key: string): T {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : ([] as T);
  }
  private saveToStorage(key: string, data: any) {
    localStorage.setItem(key, JSON.stringify(data));
  }
  private updateExpiredBookings() {
    const allBookings = this.readFromStorage<Booking[]>(this.booking_key);
    const now = new Date();
    let wasChanged = false;

    const bookingsToUpdate = allBookings.map((b) => {
      if (b.status !== 'активна') return b;
      const bookingEndDateTime = new Date(`${b.date}T${b.endTime}`);
      if (bookingEndDateTime < now) {
        wasChanged = true;
        return { ...b, status: 'completed' };
      }

      return b;
    });
    if (wasChanged) this.saveToStorage(this.booking_key, bookingsToUpdate);
  }
  private isTimeOverlapping(startA: string, endA: string, startB: string, endB: string): boolean {
    return startA < endB && endA > startB;
  }
  private seedDatabase() {
    if (!localStorage.getItem(this.room_key)) {
      const demoRooms: Room[] = [
        { id: crypto.randomUUID(), name: 'Альфа', capacity: 4, equipment: ['Белая доска'] },
        {
          id: crypto.randomUUID(),
          name: 'Бетта',
          capacity: 12,
          equipment: ['Проектор', 'Видео конференции'],
        },
        { id: crypto.randomUUID(), name: 'Гамма', capacity: 2, equipment: ['Монитор'] },
      ];
      this.saveToStorage(this.room_key, demoRooms);
    }
    if (!localStorage.getItem(this.booking_key)) {
      this.saveToStorage(this.booking_key, []);
    }
    if (!localStorage.getItem(this.users_key)) {
      const demoUsers: User[] = [
        { id: crypto.randomUUID(), name: 'Алекс', role: 'работник' },
        { id: crypto.randomUUID(), name: 'Борис', role: 'работник' },
        { id: crypto.randomUUID(), name: 'Гена', role: 'админ' },
      ];
      this.saveToStorage(this.users_key, demoUsers);
    }
  }
}
