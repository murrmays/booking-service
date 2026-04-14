import { Component } from '@angular/core';
import { RoomService } from '../room-service/room-service';
import { AbstractControl, AsyncValidator, ValidationErrors } from '@angular/forms';
import { catchError, debounceTime, distinctUntilChanged, map, Observable, of, switchMap, timer } from 'rxjs';

@Component({
  selector: 'app-room-async-validator',
  imports: [],
  templateUrl: './room-async-validator.html',
  styleUrl: './room-async-validator.css',
})
export class RoomAsyncValidator implements AsyncValidator {
  constructor(private roomService: RoomService) {}

  validate = (control: AbstractControl): Observable<ValidationErrors | null> => {
    const roomId = control.get('roomId')?.value;
    const date = control.get('date')?.value;
    const startTime = control.get('startTime')?.value;
    const endTime = control.get('endTime')?.value;

    if (!roomId || !date || !startTime || !endTime) return of(null);

    return timer(500).pipe(
      switchMap(() => this.roomService.checkRoomAvailability(roomId, date, startTime, endTime)),
      map(isOccupied => {
        return isOccupied ? { roomOccupied: true } : null;
      }),
      catchError(() => of(null)),
    );
  };
}
