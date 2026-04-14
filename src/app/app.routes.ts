import { Routes } from '@angular/router';
import { BookRoomComponent } from './features/book-room/ui/book-room-component/book-room-component';
import { MyBookingsComponent } from './features/my-bookings/ui/my-bookings-component/my-bookings-component';

export const routes: Routes = [
    {path: '', component: BookRoomComponent},
    {path: 'book', component: BookRoomComponent},
    {path: 'my-bookings', component: MyBookingsComponent}
];
