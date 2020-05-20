import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IndexPageComponent } from './index-page/index-page.component';
import { StreamPageComponent } from './stream-page/stream-page.component';
import { StreamstatService } from './streamstat.service';
import { ChannelPickerComponent } from './components/channel-picker/channel-picker.component';
import { AngularDropdownModule } from 'angular-dropdown';
@NgModule({
  declarations: [AppComponent, IndexPageComponent, StreamPageComponent, ChannelPickerComponent],
  providers: [StreamstatService],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule, AngularDropdownModule],
  bootstrap: [AppComponent],
})
export class AppModule {}
