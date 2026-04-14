import { Component, computed, inject } from '@angular/core';
import { AuthService } from '../../data/auth-service/auth-service';
import { MockDatabaseService } from '../../data/mock-database-service/mock-database-service';
import { User } from '../../domain/models/user';
import { toSignal } from '@angular/core/rxjs-interop';
import { UserSelectorComponent } from '../user-selector-component/user-selector-component';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [UserSelectorComponent, RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  private authService = inject(AuthService);
  private db = inject(MockDatabaseService);

  currentUser = this.authService.currentUser;
  username = computed(() => (this.currentUser() ? this.currentUser()!.name : 'Гость'));
  allUsers = toSignal(this.db.getUsers())

  onUserSelect(user: User) {
    this.authService.login(user);
  }
  onLogout() {
    this.authService.logout();
  }
}
