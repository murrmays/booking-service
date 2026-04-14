import { Component, input } from '@angular/core';
import { Room } from '../../domain/room/models/room';

@Component({
  selector: 'app-room-card-component',
  imports: [],
  templateUrl: './room-card-component.html',
  styleUrl: './room-card-component.css',
})
export class RoomCardComponent {
  roomInfo = input.required<Room>()
}
