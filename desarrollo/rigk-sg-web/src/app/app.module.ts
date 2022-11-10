import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
<<<<<<< HEAD
import { RouterModule } from '@angular/router';
=======
>>>>>>> 67ff8093ae66dd03c9d92d323decaa09ab11ba78
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
<<<<<<< HEAD
    SharedModule,
    RouterModule,
    HttpClientModule,
=======
    HttpClientModule,
    SharedModule
>>>>>>> 67ff8093ae66dd03c9d92d323decaa09ab11ba78
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
