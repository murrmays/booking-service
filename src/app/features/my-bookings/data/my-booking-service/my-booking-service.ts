import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../../../core/data/auth-service/auth-service';
import { Observable, of } from 'rxjs';
import { Booking } from '../../../book-room/domain/booking/models/booking';
import { MockDatabaseService } from '../../../../core/data/mock-database-service/mock-database-service';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-my-booking-service',
  imports: [],
  templateUrl: './my-booking-service.html',
  styleUrl: './my-booking-service.css',
})
export class MyBookingService {
  private authService = inject(AuthService);
  private db = inject(MockDatabaseService);

  getMyBookings(): Observable<Booking[]> {
    const userId = this.authService.getCurrentUserId();

    if (!userId) return of([]);

    return this.db.getBookingsByUserId(userId);
  }
  cancelBooking(id: string): Observable<Booking | undefined> {
    return this.db.setBookingStatus(id, "отменена")
  }
}
