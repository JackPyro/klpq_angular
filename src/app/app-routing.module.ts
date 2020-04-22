import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {IndexPageComponent} from './index-page/index-page.component';
import {StreamPageComponent} from './stream-page/stream-page.component';
import {ViewStreamComponent} from './stream-page/view-stream/view-stream.component';

const routes: Routes = [
  {path: '', component: IndexPageComponent},
  {
    path: 'stream',
    children: [
      {path: '', component: StreamPageComponent},
      {path: ':stream', component: ViewStreamComponent, pathMatch: 'full'},
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
