import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatButtonModule} from "@angular/material/button";
import {AuthModule} from "./auth/auth.module";
import {MatIconModule} from "@angular/material/icon";
import {MatSidenavModule} from "@angular/material/sidenav";
import {RouterModule} from "@angular/router";
import {MatCardModule} from "@angular/material/card";
import {TaskComponent} from './task/task.component';
import {LogComponent} from './log/log.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

@NgModule({
  declarations: [
    AppComponent,
    TaskComponent,
    LogComponent,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatButtonModule,
    AuthModule.forRoot(),
    MatIconModule,
    MatSidenavModule,
    RouterModule.forRoot([
      {path: '', redirectTo: '/task', pathMatch: 'full'},
      {path: "task", component: TaskComponent},
      {path: "log", component: LogComponent},
      { path: '**', component: PageNotFoundComponent }
    ]),
    MatCardModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
