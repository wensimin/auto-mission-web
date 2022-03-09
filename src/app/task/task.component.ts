import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {FormBuilder} from "@angular/forms";
import {PageServiceService} from "../service/page-service.service";
import {HttpClient} from "@angular/common/http";
import {Task} from "../model/Models";
import {SnackBarServiceService} from "../service/snack-bar-service.service";
import {environment} from "../../environments/environment";

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

  constructor(private fb: FormBuilder,
              private pageService: PageServiceService,
              private httpClient: HttpClient,
              private snackBarServiceService: SnackBarServiceService
  ) {
  }

  ngAfterViewInit(): void {
    this.pageService
      .page<Task>("task", this.queryForm, this.paginator, this.sort)
      .subscribe(page => {
        this.resultsLength = page.totalElements
        this.tasks = page.content
      })
  }


  switchTask(task: Task) {
    this.httpClient.put(`${environment.resourceServer}/task/${task.id}`, {},
      {params: {"enabled": !task.enabled}}).subscribe(() => {
        this.snackBarServiceService.message({type: "success", message: "更改任务状态成功"})
        task.enabled = !task.enabled
      }
    )
  }
}

