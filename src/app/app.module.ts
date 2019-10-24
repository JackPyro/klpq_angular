import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { IndexPageComponent } from "./index-page/index-page.component";
import { StreamPageComponent } from "./stream-page/stream-page.component";
import { ViewStreamComponent } from "./stream-page/view-stream/view-stream.component";
import { StreamstatService } from "./streamstat.service";
@NgModule({
  declarations: [
    AppComponent,
    IndexPageComponent,
    StreamPageComponent,
    ViewStreamComponent
  ],
  providers: [StreamstatService],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule],
  bootstrap: [AppComponent]
})
export class AppModule {}
