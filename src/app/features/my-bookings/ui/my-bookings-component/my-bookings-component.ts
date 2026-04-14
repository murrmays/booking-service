import { Component, inject, signal } from '@angular/core';
import { MyBookingStateService } from '../../data/my-booking-state-service/my-booking-state-service';
import { BookingsTableComponent } from "../bookings-table-component/bookings-table-component";

@Component({
  selector: 'app-my-bookings-component',
  imports: [BookingsTableComponent],
  templateUrl: './my-bookings-component.html',
  styleUrl: './my-bookings-component.css',
})
export class MyBookingsComponent {
  private stateService = inject(MyBookingStateService)

  bookings = this.stateService.state
  isLoading = this.stateService.isLoading

  constructor(){
    this.stateService.loadBookings()
  }

  handleCancel(id: string){
    this.stateService.handleCancelation(id)
  }
}
