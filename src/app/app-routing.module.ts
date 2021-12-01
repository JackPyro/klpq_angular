import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IndexPageComponent } from './index-page/index-page.component';
import { StreamPageComponent } from './stream-page/stream-page.component';
import { MinimalComponent } from './stream-page/minimal/minimal.component';

const routes: Routes = [
  {
    path: '',
    component: IndexPageComponent,
  },
  {
    path: 'stream/:app/:stream/:protocol',
    component: StreamPageComponent,
  },
  {
    path: 'stream/:app/:stream',
    component: StreamPageComponent,
  },
  {
    path: 'stream/:stream',
    component: StreamPageComponent,
  },
  {
    path: 'stream',
    component: StreamPageComponent,
  },
  {
    path: 'minimal/:stream',
    component: MinimalComponent,
  },
  {
    path: 'minimal',
    component: MinimalComponent,
  },
  {
    path: '**',
    redirectTo: '/',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
