import {AfterViewInit, Component, EventEmitter, ViewChild} from '@angular/core';
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";
import {FormBuilder} from "@angular/forms";
import {PageServiceService} from "../service/page-service.service";
import {interval, Subscription} from "rxjs";
import {ActivatedRoute} from "@angular/router";
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
  displayedColumns: string[] = ['level', 'text', 'createDate', 'action'];
  resultsLength: number = 0;
  queryEmitter = new EventEmitter()
  realTime = false

  private timeInterval: Subscription | undefined;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  queryForm = this.fb.group({
    startDate: [null],
    endDate: [null],
    level: [''],
    text: [''],
    taskId: ['']
  })

  dateRangeError = new HasErrorMatcher(['dateRange']);


  constructor(
    private fb: FormBuilder,
    private pageService: PageServiceService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private logger: NGXLogger
  ) {
    this.route.queryParams.subscribe(value => {
      let id = value["taskId"]
      if (id) this.queryForm.controls["taskId"].setValue(id)
    })
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
      })

    this.timeInterval = interval(1000).subscribe(() => {
      if (this.realTime) this.queryEmitter.emit()
    })
  }

  /**
   * 搜索时间点前后的范围log
   * @param date 时间点
   */
  filterLog(date: string) {
    // 目前hard code 5min
    const range = 5 * 60 * 1000
    const startDate = new Date(Date.parse(date) - range)
    const endDate = new Date(Date.parse(date) + range)
    this.queryForm.controls["startDate"].setValue(startDate)
    this.queryForm.controls["endDate"].setValue(endDate)
  }
}


interface TaskLog {
  level: String,
  text: String,
  taskId: String,
  id: String,
  createDate: String
}
