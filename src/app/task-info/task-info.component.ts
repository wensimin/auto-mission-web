import {AfterViewInit, Component} from '@angular/core';
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
import {HttpClient} from "@angular/common/http";
import {Task} from "../model/Models";
import {environment} from "../../environments/environment";
import {catchError, of} from "rxjs";
import {SnackBarServiceService} from "../service/snack-bar-service.service";
import {MatDialog} from "@angular/material/dialog";
import {TestCodeDialogComponent} from "../test-code-dialog/test-code-dialog.component";
import {DeleteTaskDialogComponent} from "../delete-task-dialog/delete-task-dialog.component";
import {ErrorStateMatcher} from "@angular/material/core";

@Component({
  selector: 'app-task-info',
  templateUrl: './task-info.component.html',
  styleUrls: ['./task-info.component.scss']
})
export class TaskInfoComponent implements AfterViewInit {

  editorOptions = {theme: 'vs-dark', language: 'kotlin'}
  taskForm: FormGroup = this.fb.group(new Task())
  id: String | undefined
  //short ref
  f = this.taskForm.controls

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private httpClient: HttpClient,
    private snackBarServiceService: SnackBarServiceService,
    private dialog: MatDialog
  ) {
    this.setValidators()
    this.activatedRoute.params.subscribe(params => {
      this.id = params["id"]
      if (this.id) {
        this.loadTask(this.id)
      } else {
        this.newTask()
      }
    })
  }

  ngAfterViewInit(): void {

  }

  saveTask() {
    //save时 进行touch 触发验证错误消息显示
    for (let fKey in this.f) {
      this.f[fKey].markAsTouched()
    }
    console.log(this.taskForm.errors)
    if (this.taskForm.invalid) return
    this.httpClient.post(`${environment.resourceServer}/task`, this.taskForm.value)
      .subscribe(() => {
          this.snackBarServiceService.message({type: "success", message: "保存成功"})
          this.router.navigate(['/task']).then()
        }
      )
  }

  testCode() {
    this.httpClient.post(`${environment.resourceServer}/task/testCode`, {"code": this.taskForm.value.code},
      {responseType: 'text'})
      .subscribe(res => {
        this.dialog.open(TestCodeDialogComponent, {
          data: res
        })
      })
  }

  private loadTask(id: String) {
    this.httpClient.get<Task>(`${environment.resourceServer}/task/${id}`).pipe(
      catchError(() => {
          this.router.navigate(['/notFound']).then()
          return of(null)
        }
      )).subscribe(task => {
        if (task) {
          this.taskForm.setValue(task)
        }
      }
    )
  }

  private newTask() {
    // 读取api的代码模板进行初始化
    this.httpClient.get(`${environment.resourceServer}/task/template`, {responseType: 'text'})
      .subscribe(res => {
        let task = new Task()
        task.code = res
        this.taskForm.setValue(task)
      })
  }

  deleteTask() {
    this.dialog.open(DeleteTaskDialogComponent, {
      data: this.taskForm.value
    }).afterClosed().subscribe(confirm => {
      if (confirm) {
        this.httpClient.delete(`${environment.resourceServer}/task/${this.id}`)
          .subscribe(() => {
              this.snackBarServiceService.message({type: "success", message: "删除成功"})
              this.router.navigate(['/task']).then()
            }
          )
      }
    })
  }

  private setValidators() {
    this.taskForm.setControl("name", new FormControl(null, [Validators.required, Validators.maxLength(255)]))
    this.taskForm.setControl("code", new FormControl(null, [Validators.required]))
    this.taskForm.setControl("description", new FormControl(null, [Validators.required]))
    this.taskForm.addValidators(this.runnableValidation)
    this.taskForm.updateValueAndValidity()
  }

  cronError = new HasErrorMatcher(['runRequired', 'cronInvalid'])
  intervalError = new HasErrorMatcher(['runRequired'])

  runnableValidation(control: AbstractControl): ValidationErrors | null {
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
}

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



