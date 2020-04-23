import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {IndexPageComponent} from './index-page/index-page.component';
import {StreamPageComponent} from './stream-page/stream-page.component';

const routes: Routes = [
  {path: '', component: IndexPageComponent},
  {
    path: 'stream/:stream',
    component: StreamPageComponent,
  },

  {
    path: 'stream',
    component: StreamPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
