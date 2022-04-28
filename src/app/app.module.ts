import {APP_INITIALIZER, LOCALE_ID, NgModule} from '@angular/core';
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
  NgxMatDateAdapter,
  NgxMatDatetimePickerModule,
  NgxMatNativeDateModule,
  NgxMatTimepickerModule
} from '@angular-material-components/datetime-picker';
import {MatListModule} from "@angular/material/list";
import {MatTableModule} from "@angular/material/table";
import {MatSortModule} from "@angular/material/sort";
import {MatPaginatorIntl, MatPaginatorModule} from "@angular/material/paginator";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ChinesePaginatorIntl} from "./bean/ChineseMatPaginatorIntl";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {SnackBarComponent} from './snack-bar/snack-bar.component';
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {HttpErrorInterceptor} from "./service/http-error-interceptor";
import {InitServiceService} from "./service/init-service.service";
import {MatSelectModule} from "@angular/material/select";
import {ClipboardModule} from "@angular/cdk/clipboard";
import {MonacoEditorModule} from "@materia-ui/ngx-monaco-editor";
import {TaskInfoComponent} from './task-info/task-info.component';
import {MatRadioModule} from "@angular/material/radio";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {DebugCodeDialogComponent} from './debug-code-dialog/debug-code-dialog.component';
import {MatDialogModule} from "@angular/material/dialog";
import {ConfirmDialogComponent} from './confirm-dialog/confirm-dialog.component';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {TaskEditGuard} from "./task-info/task-edit.guard";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MessageDialogComponent} from './message-dialog/message-dialog.component';
import {LoggerModule, NgxLoggerLevel} from "ngx-logger";
import {ChineseDateAdapter} from "./bean/chinese-date-adapter";
import localeCn from '@angular/common/locales/zh';
import {registerLocaleData} from "@angular/common";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatRippleModule} from "@angular/material/core";
import {StoreComponent} from './store/store.component';
import {EditStoreDialogComponent} from './store/edit-store-dialog/edit-store-dialog.component';
import {SystemStateComponent} from './system-state/system-state.component';
import {TaskInstanceComponent} from './task-instance/task-instance.component';

registerLocaleData(localeCn);

@NgModule({
  imports: [
    RouterModule.forRoot([
      {path: '', redirectTo: '/task', pathMatch: 'full'},
      {path: "task", component: TaskComponent},
      {path: "task/new", component: TaskInfoComponent, canDeactivate: [TaskEditGuard]},
      {path: "task/:id", component: TaskInfoComponent, canDeactivate: [TaskEditGuard]},
      {path: "taskInstance", component: TaskInstanceComponent},
      {path: "log", component: LogComponent},
      {path: "store", component: StoreComponent},
      {path: "state", component: SystemStateComponent},
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
    MatListModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatSelectModule,
    ClipboardModule,
    FormsModule,
    MatRadioModule,
    MatSlideToggleModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatNativeDateModule,
    LoggerModule.forRoot({
      level: NgxLoggerLevel.DEBUG,
      serverLogLevel: NgxLoggerLevel.DEBUG
    }),
    MatTooltipModule,
    MatRippleModule,
  ],
  declarations: [
    AppComponent,
    TaskComponent,
    LogComponent,
    PageNotFoundComponent,
    SnackBarComponent,
    TaskInfoComponent,
    DebugCodeDialogComponent,
    ConfirmDialogComponent,
    MessageDialogComponent,
    StoreComponent,
    EditStoreDialogComponent,
    SystemStateComponent,
    TaskInstanceComponent
  ],
  providers: [
    // 编辑器用
    TaskEditGuard,
    // 分页器chinese
    {provide: MatPaginatorIntl, useClass: ChinesePaginatorIntl},
    // 全局错误拦截器
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true
    },
    // 用于angular pipe的locale
    {provide: LOCALE_ID, useValue: 'zh-CN'},
    {
      provide: NgxMatDateAdapter,
      useClass: ChineseDateAdapter
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
