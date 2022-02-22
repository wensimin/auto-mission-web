import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.css']
})
export class LogComponent implements OnInit {

  logs: TaskLog[] | undefined

  constructor(private httpClient: HttpClient) {
  }

  ngOnInit(): void {
    this.findTaskLog()
  }

  findTaskLog() {
    this.httpClient.get<Page<TaskLog>>(environment.resourceServer + "/taskLog").subscribe(page =>
      this.logs = page.content
    )
  }

}

interface Page<T> {
  content: T[],
  totalPages: number,
  totalElements: number,
  last: boolean,
  /**
   * page number
   */
  number: number,
  /**
   * page size
   */
  size: number
}

interface TaskLog {
  label: String,
  text: String,
  taskId: String,
  id: String,
  createDate: String
}
