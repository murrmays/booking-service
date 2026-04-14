import { Component, computed, inject, signal } from '@angular/core';
import { AuthService } from '../../../../core/data/auth-service/auth-service';
import { RoomService } from '../../data/room-service/room-service';
import { Room } from '../../domain/room/models/room';
import { RoomFilter } from '../../domain/room/models/room-filter';
import { BookingDraft } from '../../domain/booking/models/booking-draft';
import { RoomCardComponent } from '../room-card-component/room-card-component';
import { BookingFormComponent } from '../booking-form-component/booking-form-component';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-book-room-component',
  imports: [RoomCardComponent, BookingFormComponent],
  templateUrl: './book-room-component.html',
  styleUrl: './book-room-component.css',
})
export class BookRoomComponent {
  private authService = inject(AuthService);
  private bookingService = inject(RoomService);

  availableRooms = signal<Room[] | []>([]);
  isSearching = signal(false);
  isSubmitting = signal(false);
  isError = signal(false);
  message = signal<string>('');

  handleFilterChange(filter: RoomFilter) {
    this.isSearching.set(true);
    this.message.set('');

    this.bookingService.getFilteredRooms(filter).subscribe({
      next: (rooms) => {
        this.availableRooms.set(rooms);
        this.isSearching.set(false);
      },
      error: () => {
        this.message.set('Ошибка при поиске комнат');
        this.isSearching.set(false);
      },
    });
  }
  handleBookingSubmit(draft: BookingDraft) {
    const user = this.authService.currentUser();
    this.message.set('');

    if (!user) {
      this.message.set('Сначала войдите в систему');
      this.isError.set(true)
      return;
    }
    this.isSubmitting.set(true);
    const fullDraft: BookingDraft = {
      ...draft,
      employeeName: user.name
    }

    this.bookingService.bookRoom(draft).subscribe({
      next: (res) => {
        this.message.set('Комната успешно забронирована');
        this.isError.set(false);
        this.availableRooms.set([]);
        this.isSubmitting.set(false);
      },
      error: () => {
        this.message.set('Произошла ошибка прит бронировании');
        this.isError.set(true);
        this.isSubmitting.set(false);
      },
    });
  }
}
