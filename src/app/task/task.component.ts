import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {FormBuilder} from "@angular/forms";
import {PageServiceService} from "../service/page-service.service";

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements AfterViewInit {


  tasks: Task[] = []
  displayedColumns: string[] = ['name', 'cronExpression', 'enabled', 'createDate', 'updateDate', 'action'];
  resultsLength: number = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  queryForm = this.fb.group({
    name: [''],
    description: [''],
    enabled: [null]
  })

  constructor(private fb: FormBuilder,
              private pageService: PageServiceService) {
  }

  ngAfterViewInit(): void {
    this.pageService
      .page<Task>("task", this.queryForm, this.paginator, this.sort)
      .subscribe(page => {
        this.resultsLength = page.totalElements
        this.tasks = page.content
      })
  }


}

interface Task {
  id: String
  name: String
  description: String
  code: String
  cronExpression: String
  enabled: Boolean
  createDate: String
  updateDate: String
}
