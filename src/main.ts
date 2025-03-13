import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';  // ✅ Verify this path
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';           // ✅ Verify this path

bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes)]
}).catch(err => console.error(err));
