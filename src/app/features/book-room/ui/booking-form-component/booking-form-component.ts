import { Component, inject, input, output } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RoomAsyncValidator } from '../../data/room-async-validator/room-async-validator';
import { Room } from '../../domain/room/models/room';
import { generateTimeSlots, isStartBeforeEnd } from '../../domain/helpers';
import { RoomFilter } from '../../domain/room/models/room-filter';
import { BookingDraft } from '../../domain/booking/models/booking-draft';

@Component({
  selector: 'app-booking-form-component',
  imports: [ReactiveFormsModule],
  templateUrl: './booking-form-component.html',
  styleUrl: './booking-form-component.css',
})
export class BookingFormComponent {
  private formBuilder = inject(FormBuilder);
  private asyncValidator = inject(RoomAsyncValidator);

  availableRooms = input<Room[]>([]);
  isSubmitting = input<boolean>(false);
  formSubmit = output<any>();
  filterChange = output<RoomFilter>();
  timeSlots = generateTimeSlots(9, 18, 60);

  form = this.formBuilder.nonNullable.group({
    date: ['', Validators.required],
    startTime: ['', Validators.required],
    endTime: ['', Validators.required],
    roomId: ['', Validators.required],
    minCapacity: [''],
    equipSearch: ['']
  }, {
    validators: this.timeRangeValidator,
    asyncValidators: [this.asyncValidator.validate]
  });

  constructor(){
    this.form.valueChanges.subscribe(value => {
      if (value.date && value.startTime && value.endTime && !this.form.hasError('invalidTime')){
        this.filterChange.emit({
          date: value.date,
          startTime: value.startTime,
          endTime: value.endTime,
          minCapacity: value.minCapacity ? Number(value.minCapacity) : undefined,
          equipSearch: value.equipSearch || ''
        })
      }
    })
  }

  private timeRangeValidator(group: AbstractControl) {
    const start = group.get('startTime')?.value;
    const end = group.get('endTime')?.value;
    return (start && end && !isStartBeforeEnd(start, end)) ? { invalidTime: true } : null;
  }

  onSubmit() {
    if (this.form.valid) {
      this.formSubmit.emit(this.form.getRawValue());
    }
  }
}
