import { Component, input, output } from '@angular/core';
import { Booking } from '../../../book-room/domain/booking/models/booking';

@Component({
  selector: 'app-bookings-table-component',
  imports: [],
  templateUrl: './bookings-table-component.html',
  styleUrl: './bookings-table-component.css',
})
export class BookingsTableComponent {
  bookings = input<Booking[]>([])
  canceledBookingId = output<string>()

  cancelBooking(id: string){
    this.canceledBookingId.emit(id)
  }
}
