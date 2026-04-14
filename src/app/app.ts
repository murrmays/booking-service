import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BookRoomComponent } from './features/book-room/ui/book-room-component/book-room-component';
import { Header } from './core/ui/header/header';
import { MyBookingsComponent } from './features/my-bookings/ui/my-bookings-component/my-bookings-component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('booking-system');
}
