import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IndexPageComponent } from './index-page/index-page.component';
import { StreamPageComponent } from './stream-page/stream-page.component';
import { MinimalComponent } from './stream-page/minimal/minimal.component';
import { RedirectComponent } from './redirect-page/redirect-page.component';
import { environment } from 'src/environments/environment';

let routes: Routes = [];

if (environment.CURRENT_PAGE === 'www') {
  routes.push({
    path: 'minimal/:stream',
    component: MinimalComponent,
  });
  routes.push({
    path: 'minimal',
    component: MinimalComponent,
  });
  routes.push({
    path: 'stream',
    component: RedirectComponent,
    children: [
      {
        path: '**',
        component: RedirectComponent,
      },
    ],
  });
  routes.push({
    path: 'stream',
    component: RedirectComponent,
  });
  routes.push({
    path: '',
    component: IndexPageComponent,
  });
}

if (environment.CURRENT_PAGE === 'stream') {
  routes.push({
    path: ':app/:stream/:protocol',
    component: StreamPageComponent,
  });
  routes.push({
    path: ':app/:stream',
    component: StreamPageComponent,
  });
  routes.push({
    path: ':stream',
    component: StreamPageComponent,
  });
  routes.push({
    path: '',
    component: StreamPageComponent,
  });
  routes.push();
}

// routes.push({
//   path: '**',
//   redirectTo: '/',
//   pathMatch: 'full',
// });

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
