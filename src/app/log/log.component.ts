import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";
import {FormBuilder} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";
import {PageServiceService} from "../service/page-service.service";

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.scss'],
  providers: []
})
export class LogComponent implements AfterViewInit {

  logs: TaskLog[] = []
  displayedColumns: string[] = ['label', 'text', 'createDate', 'action'];
  resultsLength: number = 0;


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  queryForm = this.fb.group({
    startDate: [''],
    endDate: [''],
    label: [''],
    text: [''],
    taskId: ['']
  })


  constructor(
    private httpClient: HttpClient,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
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
  label: String,
  text: String,
  taskId: String,
  id: String,
  createDate: String
}
