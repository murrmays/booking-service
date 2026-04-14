import { Component, inject } from '@angular/core';
import { RoomFilter } from '../../domain/room/models/room-filter';
import { Room } from '../../domain/room/models/room';
import { MockDatabaseService } from '../../../../core/data/mock-database-service/mock-database-service';
import { map, Observable, of, switchMap } from 'rxjs';
import { BookingDraft } from '../../domain/booking/models/booking-draft';
import { Booking } from '../../domain/booking/models/booking';
import { AuthService } from '../../../../core/data/auth-service/auth-service';

@Component({
  selector: 'app-room-service',
  imports: [],
  templateUrl: './room-service.html',
  styleUrl: './room-service.css',
})
export class RoomService {
  private database = inject(MockDatabaseService);
  private authService = inject(AuthService);

  getAllRooms(): Observable<Room[]> {
    return this.database.getRooms();
  }
  getFilteredRooms(filter: RoomFilter): Observable<Room[]> {
    return this.database.searchRooms(filter);
  }
  bookRoom(draft: BookingDraft): Observable<Booking | undefined> {
    const currentUserId = this.authService.getCurrentUserId();
    const room = this.database.getRoomById(draft.roomId);

    if (!currentUserId || !room) return of(undefined);
    return this.database.getRoomById(draft.roomId).pipe(
      switchMap((room) => {
        if (!room) return of(undefined);

        return this.database.createBooking(draft, currentUserId, room);
      }),
    );
  }
  checkRoomAvailability(
    roomId: string,
    date: string,
    startTime: string,
    endTime: string,
  ): Observable<boolean> {
    return this.database.checkTimeOverlap(roomId, date, startTime, endTime);
  }
}
