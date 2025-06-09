import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent }         from './app/app.component';
import { appConfig }            from './app/app.config';
import { provideHttpClient }    from '@angular/common/http';
import { provideAnimations }    from '@angular/platform-browser/animations';
import { provideRouter }        from '@angular/router';
import { importProvidersFrom }  from '@angular/core';

import { ToastrModule }         from 'ngx-toastr';
import { SweetAlert2Module }    from '@sweetalert2/ngx-sweetalert2';
import { routes }               from './app/app.routes';

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideAnimations(),

    importProvidersFrom(
      ToastrModule.forRoot({
        timeOut: 3000,
        positionClass: 'toast-bottom-right',
        preventDuplicates: true
      }),
      SweetAlert2Module.forRoot()
    ),

    ...appConfig.providers
  ]
})
.catch(err => console.error(err));
