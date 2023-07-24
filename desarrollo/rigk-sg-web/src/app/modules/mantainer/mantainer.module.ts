import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MantainerRoutingModule } from './mantainer-routing.module';
import { HomeComponent } from './pages/home/home.component';
import { MaintainerBusinessComponent } from './pages/maintainer-business/maintainer-business.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MantainerUsersComponent } from './pages/mantainer-users/mantainer-users.component';
import { MaintainerEstablishmentComponent } from './pages/maintainer-establishment/maintainer-establishment.component';

import {MultiSelectModule} from 'primeng/multiselect';
import { SharedModule } from 'src/app/shared/shared.module';
import { MaintainerDeclarationsProductorComponent } from './pages/maintainer-declarations-productor/maintainer-declarations-productor.component';
import { MaintainerManagersComponent } from './pages/maintainer-managers/maintainer-managers.component';
import { LogsComponent } from './pages/logs/logs.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { NgxChartsModule }from '@swimlane/ngx-charts';


@NgModule({
  declarations: [
    HomeComponent,
    MaintainerBusinessComponent,
    ProfileComponent,
    MaintainerEstablishmentComponent,
    MantainerUsersComponent,
    MaintainerDeclarationsProductorComponent,
    MaintainerManagersComponent,
    LogsComponent,
    DashboardComponent
  ],
  imports: [
    CommonModule,
    MantainerRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MultiSelectModule,
    SharedModule,
    NgxChartsModule
  ]
})
export class MantainerModule { }
