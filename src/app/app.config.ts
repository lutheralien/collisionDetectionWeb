import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { authInterceptor } from './interceptors/auth.interceptor';
import { provideAnimations } from '@angular/platform-browser/animations';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Socket, SocketIoConfig } from 'ngx-socket-io';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

const config: SocketIoConfig = {
  url: 'http://localhost:5001', // Flask backend URL
  options: {
    transports: ['websocket'], // Allow both WebSocket and polling
  }
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideCharts(withDefaultRegisterables()),
    MessageService,
    importProvidersFrom(ToastModule),
    provideAnimations(),
    { 
      provide: Socket, 
      useFactory: () => new Socket(config)
    }
  ]
};