import { Component, effect, inject, signal } from '@angular/core';
import { Booking } from '../../../book-room/domain/booking/models/booking';
import { MyBookingService } from '../my-booking-service/my-booking-service';
import { AuthService } from '../../../../core/data/auth-service/auth-service';

@Component({
  selector: 'app-my-booking-state-service',
  imports: [],
  templateUrl: './my-booking-state-service.html',
  styleUrl: './my-booking-state-service.css',
})
export class MyBookingStateService {
  private service = inject(MyBookingService);
  private authService = inject(AuthService);
  state = signal<Booking[] | []>([]);
  isLoading = signal(false);

  constructor() {
    effect(
      () => {
        const user = this.authService.currentUser();
        this.loadBookings();
      },
      { allowSignalWrites: true },
    );
  }

  loadBookings() {
    this.isLoading.set(true);

    this.service.getMyBookings().subscribe({
      next: (data) => {
        this.state.set(data);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }
  handleCancelation(id: string) {
    this.service.cancelBooking(id).subscribe({
      next: () => {
        this.state.update((allBookings) =>
          allBookings.map((b) => (b.id === id ? { ...b, status: 'отменена' } : b)),
        );
      },
    });
  }
}
