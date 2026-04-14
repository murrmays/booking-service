import { Component, inject, signal } from '@angular/core';
import { Booking } from '../../../book-room/domain/booking/models/booking';
import { MyBookingService } from '../my-booking-service/my-booking-service';

@Component({
  selector: 'app-my-booking-state-service',
  imports: [],
  templateUrl: './my-booking-state-service.html',
  styleUrl: './my-booking-state-service.css',
})
export class MyBookingStateService {
  private service = inject(MyBookingService);
  state = signal<Booking[] | []>([]);
  isLoading = signal(false);

  constructor() {
    this.loadBookings();
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
