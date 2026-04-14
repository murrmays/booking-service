import { ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { AuthService } from './core/data/auth-service/auth-service';
import { RoomService } from './features/book-room/data/room-service/room-service';
import { MockDatabaseService } from './core/data/mock-database-service/mock-database-service';
import { RoomAsyncValidator } from './features/book-room/data/room-async-validator/room-async-validator';
import { MyBookingStateService } from './features/my-bookings/data/my-booking-state-service/my-booking-state-service';
import { MyBookingService } from './features/my-bookings/data/my-booking-service/my-booking-service';
import { LucideAngularModule, Moon, Sun } from 'lucide-angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    AuthService,
    RoomService,
    MockDatabaseService,
    RoomAsyncValidator,
    MyBookingStateService,
    MyBookingService,
    importProvidersFrom(
      LucideAngularModule.pick({ Moon, Sun})
    )
  ]
};
