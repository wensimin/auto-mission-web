import {AfterViewInit, Component, ElementRef, EventEmitter, ViewChild} from '@angular/core';
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";
import {FormBuilder} from "@angular/forms";
import {PageServiceService} from "../service/page-service.service";
import {interval, Subscription} from "rxjs";
import {Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {MessageDialogComponent} from "../message-dialog/message-dialog.component";
import {NGXLogger} from "ngx-logger";
import {HasErrorMatcher} from "../task-info/task-info.component";

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.scss'],
  providers: []
})
export class LogComponent implements AfterViewInit {

  logs: TaskLog[] = []
  displayedColumns: string[] = ['level', 'text', 'createDate', 'task', 'action'];
  resultsLength: number = 0;
  queryEmitter = new EventEmitter()
  realTime = false

  private timeInterval: Subscription | undefined;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild("logTable") table!: ElementRef
  queryForm = this.fb.group({
    startDate: [null],
    endDate: [null],
    level: [''],
    text: [''],
    taskId: [''],
    taskName: ['']
  })

  dateRangeError = new HasErrorMatcher(['dateRange']);


  constructor(
    private fb: FormBuilder,
    private pageService: PageServiceService,
    private dialog: MatDialog,
    private router: Router,
    private logger: NGXLogger
  ) {
    const taskId = this.router.getCurrentNavigation()?.extras.state?.['taskId']
    if (taskId) this.queryForm.controls["taskId"].setValue(taskId)
    this.queryForm.addValidators(control => {
      const startDate = control.get("startDate")?.value;
      const endDate = control.get("endDate")?.value;
      if ((startDate && endDate) && startDate > endDate) {
        return {'dateRange': true}
      }
      return null
    })
  }

  ngOnDestroy(): void {
    this.timeInterval?.unsubscribe()
  }

  showLog(message: String) {
    this.dialog.open(MessageDialogComponent, {
      data: message
    })
  }

  ngAfterViewInit(): void {
    this.logger.debug("task log init!")
    this.pageService
      .page<TaskLog>("taskLog", this.queryForm, this.paginator, this.sort, this.queryEmitter)
      .subscribe(page => {
        this.resultsLength = page.totalElements
        this.logs = page.content
        this.table.nativeElement.scrollTop = 0
      })

    this.timeInterval = interval(1000).subscribe(() => {
      if (this.realTime) this.queryEmitter.emit()
    })
  }

  /**
   * 搜索时间点前后的范围log
   * @param date 时间点
   * @param taskId 任务id
   */
  filterLog(date: string, taskId?: string) {
    this.queryForm.reset()
    // 目前hard code 前 3min 后 1s
    const range = 3 * 60 * 1000
    const startDate = new Date(Date.parse(date) - range)
    const endDate = new Date(Date.parse(date) + 1000)
    this.queryForm.controls["startDate"].setValue(startDate)
    this.queryForm.controls["endDate"].setValue(endDate)
    this.queryForm.controls["taskId"].setValue(taskId)
  }
}


interface TaskLog {
  level: String,
  text: String,
  taskId: String,
  task: SimpleTask,
  id: String,
  createDate: String
}

interface SimpleTask {
  id: String,
  name: String
}
