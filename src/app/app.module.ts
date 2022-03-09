import {APP_INITIALIZER, NgModule} from '@angular/core';
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
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  MatNativeDateModule,
  MatRippleModule
} from "@angular/material/core";
import {MatListModule} from "@angular/material/list";
import {MatTableModule} from "@angular/material/table";
import {MatSortModule} from "@angular/material/sort";
import {MatPaginatorIntl, MatPaginatorModule} from "@angular/material/paginator";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ChinesePaginatorIntl} from "./bean/ChineseMatPaginatorIntl";
import {
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter
} from "@angular/material-moment-adapter";
import 'moment/locale/ja';
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {SnackBarComponent} from './snack-bar/snack-bar.component';
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {HttpErrorInterceptor} from "./service/http-error-interceptor";
import {InitServiceService} from "./service/init-service.service";
import {MatSelectModule} from "@angular/material/select";
import {ClipboardModule} from "@angular/cdk/clipboard";
import {MonacoEditorModule} from "@materia-ui/ngx-monaco-editor";
import { TaskInfoComponent } from './task-info/task-info.component';
import {MatRadioModule} from "@angular/material/radio";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import { TestCodeDialogComponent } from './test-code-dialog/test-code-dialog.component';
import {MatDialogModule} from "@angular/material/dialog";
import { DeleteTaskDialogComponent } from './delete-task-dialog/delete-task-dialog.component';

@NgModule({
  imports: [
    RouterModule.forRoot([
      {path: '', redirectTo: '/task', pathMatch: 'full'},
      {path: "task", component: TaskComponent},
      {path: "task/new", component: TaskInfoComponent},
      {path: "task/:id", component: TaskInfoComponent},
      {path: "log", component: LogComponent},
      {path: '**', component: PageNotFoundComponent}
    ]),
    AuthModule.forRoot(),
    MonacoEditorModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatCardModule,
    MatRippleModule,
    MatListModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatSelectModule,
    ClipboardModule,
    FormsModule,
    MatRadioModule,
    MatSlideToggleModule,
    MatDialogModule,
  ],
  declarations: [
    AppComponent,
    TaskComponent,
    LogComponent,
    PageNotFoundComponent,
    SnackBarComponent,
    TaskInfoComponent,
    TestCodeDialogComponent,
    DeleteTaskDialogComponent
  ],
  providers: [
    // 分页器chinese
    {provide: MatPaginatorIntl, useClass: ChinesePaginatorIntl},
    // date pick chinese
    {provide: MAT_DATE_LOCALE, useValue: 'zh-CN'},
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
    // 全局错误拦截器
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true
    },
    InitServiceService,
    {
      provide: APP_INITIALIZER,
      useFactory: (init: InitServiceService) => () => {
        return init.load()
      },
      deps: [InitServiceService],
      multi: true
    }
  ],

  bootstrap: [AppComponent]
})
export class AppModule {
}
