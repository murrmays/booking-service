import { Component, input, output } from '@angular/core';
import { User } from '../../domain/models/user';

@Component({
  selector: 'app-user-selector-component',
  imports: [],
  templateUrl: './user-selector-component.html',
  styleUrl: './user-selector-component.css',
})
export class UserSelectorComponent {
  users = input<User[]>()
  currentUser = input<User | null>()
  select = output<User>()

  onChange(event: Event) {
  const selectElement = event.target as HTMLSelectElement;
  const userId = selectElement.value;
  const user = this.users()?.find(u => u.id === userId);
  if (user) this.select.emit(user);
}
}
