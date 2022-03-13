import {AfterViewInit, Component, HostListener} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective, NgForm,
  ValidationErrors,
  Validators
} from "@angular/forms";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Task} from "../model/Models";
import {environment} from "../../environments/environment";
import {catchError, of, throwError} from "rxjs";
import {SnackBarServiceService} from "../service/snack-bar-service.service";
import {MatDialog} from "@angular/material/dialog";
import {DebugCodeDialogComponent} from "../debug-code-dialog/debug-code-dialog.component";
import {ConfirmDialogComponent} from "../confirm-dialog/confirm-dialog.component";
import {ErrorStateMatcher} from "@angular/material/core";
import {LoadingService} from "../service/loading.service";
import * as lodash from 'lodash';
import {ErrorType} from "../service/http-error-interceptor";

@Component({
  selector: 'app-task-info',
  templateUrl: './task-info.component.html',
  styleUrls: ['./task-info.component.scss']
})
export class TaskInfoComponent implements AfterViewInit {

  editorOptions = {theme: 'vs-dark', language: 'kotlin'}
  taskForm: FormGroup = this.fb.group(new Task())
  // 干净的已经保存的任务
  clearTask: Task = new Task()
  id: String | undefined
  isNew = true
  isEdited = false
  //short ref
  f = this.taskForm.controls

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private httpClient: HttpClient,
    private snackBarServiceService: SnackBarServiceService,
    private dialog: MatDialog,
    private loadingService: LoadingService
  ) {
    this.setValidators()
    // 修改了 数据dirty化
    this.taskForm.valueChanges.subscribe(() => this.isEdited = !lodash.isEqual(this.clearTask, this.taskForm.value))
    this.activatedRoute.params.subscribe(params => {
      this.id = params["id"]
      if (this.id) {
        this.isNew = false
        this.loadTask(this.id)
      } else {
        this.newTask()
      }
    })
  }

  ngAfterViewInit(): void {
  }

  @HostListener('window:beforeunload')
  beforeunload() {
    return !this.isEdited
  }

  saveTask() {
    //save时 进行touch 触发验证错误消息显示
    for (let fKey in this.f) {
      this.f[fKey].markAsTouched()
    }
    if (this.taskForm.invalid) return
    this.httpClient.post(`${environment.resourceServer}/task`, this.taskForm.value)
      .pipe(this.loadingService.setLoading())
      .subscribe(() => {
          this.snackBarServiceService.message({type: "success", message: "保存成功"})
          this.isEdited = false
          this.clearTask = this.taskForm.value
          // 初次创建直接返回列表
          if (this.isNew) {
            this.router.navigate(['/task']).then()
          }
        }
      )
  }

  debugCode() {
    this.httpClient.post(`${environment.resourceServer}/debug`, {"code": this.taskForm.value.code})
      .pipe(
        this.loadingService.setLoading(),
        catchError((response: HttpErrorResponse) => {
          if (response.error["error"] == ErrorType.DEBUG_LIMIT) {
            this.snackBarServiceService.message({type: "error", message: "超出后端允许debug的任务限制,请稍后再试"})
          }
          return throwError(() => response);
        }))
      .subscribe(res => {
        this.dialog.open(DebugCodeDialogComponent, {
          data: res
        })
      })
  }

  private loadTask(id: String) {
    this.httpClient.get<Task>(`${environment.resourceServer}/task/${id}`).pipe(
      this.loadingService.setLoading(),
      catchError(() => {
          this.router.navigate(['/notFound']).then()
          return of(null)
        }
      )).subscribe(task => {
        if (task) {
          this.setTask(task)
        }
      }
    )
  }

  private newTask() {
    // 读取api的代码模板进行初始化
    this.httpClient.get(`${environment.resourceServer}/task/template`, {responseType: 'text'})
      .pipe(this.loadingService.setLoading())
      .subscribe(res => {
        let task = new Task()
        task.code = res
        this.setTask(task)
      })
  }

  deleteTask() {
    let task = this.taskForm.value
    this.dialog.open(ConfirmDialogComponent, {
      data: [
        `确认删除任务 ${task.name} 吗?`,
        `id为:${task.id}`
      ]
    }).afterClosed().subscribe(confirm => {
      if (confirm) {
        this.httpClient.delete(`${environment.resourceServer}/task/${this.id}`)
          .pipe(this.loadingService.setLoading())
          .subscribe(() => {
              this.snackBarServiceService.message({type: "success", message: "删除成功"})
              this.router.navigate(['/task']).then()
            }
          )
      }
    })
  }

  /**
   * 指定项设置 验证
   */
  private setValidators() {
    this.taskForm.setControl("name", new FormControl(null, [Validators.required, Validators.maxLength(255)]))
    this.taskForm.setControl("code", new FormControl(null, [Validators.required]))
    this.taskForm.setControl("description", new FormControl(null, [Validators.required]))
    this.taskForm.addValidators(this.runnableValidation)
    this.taskForm.updateValueAndValidity()
  }

  cronError = new HasErrorMatcher(['runRequired', 'cronInvalid'])
  intervalError = new HasErrorMatcher(['runRequired'])


  /**
   * 运行方式的验证，不允许间隔和cron均为空
   * 在cron有值的情况下验证cron表达式
   *
   */
  runnableValidation(control: AbstractControl): ValidationErrors | null {
    //TODO 目前和后端的验证并不完全匹配 待修改
    let cronRegex = new RegExp("(@(annually|yearly|monthly|weekly|daily|hourly|reboot))|(@every (\\d+(ns|us|µs|ms|s|m|h))+)|((((\\d+,)+\\d+|(\\d+([/\\-])\\d+)|\\d+|\\*) ?){6,7})")

    const cron: string = control.get("cronExpression")?.value;
    const interval: number = control.get("interval")?.value;

    // 全空
    if (!(cron || interval)) {
      return {'runRequired': true}
    }
    // 在输入cron表达式时才验证cron
    if (cron) {
      if (!cronRegex.test(cron)) {
        // cron表达式非法
        return {'cronInvalid': true}
      }
    }
    return null
  }

  /**
   * 编程方式set task
   * 本方法不会触发form的value change
   * 当前由于code编辑器的异步问题,会触发一次value change
   * 会将当前clearTask 设置为task
   */
  private setTask(task: Task) {
    this.clearTask = task
    this.taskForm.setValue(task, {emitEvent: false})
  }
}

/**
 * 整个表单验证不通过时报错使用该matcher的input
 */
export class HasErrorMatcher implements ErrorStateMatcher {
  constructor(private errors: String[]) {
  }

  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    for (let index in this.errors) {
      let error = this.errors[index]
      // @ts-ignore
      if (form?.errors?.[error]) return control.touched
    }
    return false
  }
}



