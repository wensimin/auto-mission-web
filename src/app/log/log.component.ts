import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";
import {FormBuilder} from "@angular/forms";
import {PageServiceService} from "../service/page-service.service";

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

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  queryForm = this.fb.group({
    startDate: [''],
    endDate: [''],
    level: [''],
    text: [''],
    taskId: ['']
  })


  constructor(
    private fb: FormBuilder,
    private pageService: PageServiceService
  ) {
  }

  ngAfterViewInit(): void {
    this.pageService
      .page<TaskLog>("taskLog", this.queryForm, this.paginator, this.sort)
      .subscribe(page => {
        this.resultsLength = page.totalElements
        this.logs = page.content
      })
  }
}

interface TaskLog {
  level: String,
  text: String,
  taskId: String,
  id: String,
  createDate: String
}
