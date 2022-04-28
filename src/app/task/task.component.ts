import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {FormBuilder} from "@angular/forms";
import {PageServiceService} from "../service/page-service.service";
import {HttpClient} from "@angular/common/http";
import {Task} from "../model/Models";
import {SnackBarServiceService} from "../service/snack-bar-service.service";
import {environment} from "../../environments/environment";
import {LoadingService} from "../service/loading.service";
import {ConfirmDialogComponent} from "../confirm-dialog/confirm-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {firstValueFrom} from "rxjs";
import {NGXLogger} from "ngx-logger";

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements AfterViewInit {


  tasks: Task[] = []
  displayedColumns: string[] = ['name', 'enabled', 'createDate', 'updateDate', 'action'];
  resultsLength: number = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  queryForm = this.fb.group({
    name: [''],
    description: [''],
    enabled: [null]
  })

  constructor(
    private fb: FormBuilder,
    private pageService: PageServiceService,
    private httpClient: HttpClient,
    private snackBarServiceService: SnackBarServiceService,
    private dialog: MatDialog,
    private loadingService: LoadingService,
    private logger: NGXLogger
  ) {
  }

  ngAfterViewInit(): void {
    this.logger.debug("task init!")
    this.pageService
      .page<Task>("task", this.queryForm, this.paginator, this.sort)
      .subscribe(page => {
        this.resultsLength = page.totalElements
        this.tasks = page.content
      })
  }


  async switchTask(task: Task) {
    let confirm = await firstValueFrom(this.dialog.open(ConfirmDialogComponent, {
      data: `确认${task.enabled ? "停止" : "启动"} ${task.name} 吗?`
    }).afterClosed()).then()
    if (!confirm) return
    this.httpClient.put(`${environment.resourceServer}/task/${task.id}`, {},
      {params: {"enabled": !task.enabled}})
      .pipe(this.loadingService.setLoading())
      .subscribe(() => {
          this.snackBarServiceService.message({type: "success", message: `${task.enabled ? "停止" : "启动"}任务成功`})
          task.enabled = !task.enabled
        }
      )
  }

  /**
   * 启动一次性任务
   * @param task
   */
  async launchTask(task: Task) {
    let confirm = await firstValueFrom(this.dialog.open(ConfirmDialogComponent, {
      data: `确认把 ${task.name} 执行一次吗?`
    }).afterClosed()).then()
    if (!confirm) return
    this.httpClient.post(`${environment.resourceServer}/task/single/${task.id}`, {},)
      .pipe(this.loadingService.setLoading())
      .subscribe(() => {
        this.snackBarServiceService.message({type: "success", message: `执行单次任务成功`})
      })
  }
}

