import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {MatSort, SortDirection} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";
import {catchError, map, merge, of, startWith, switchMap} from "rxjs";

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.scss']
})
export class LogComponent implements AfterViewInit {

  logs: TaskLog[] = []
  displayedColumns: string[] = ['label', 'text', 'createDate', 'action'];
  resultsLength: number = 0;


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private httpClient: HttpClient) {
  }

  ngAfterViewInit(): void {
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          return this.findTaskLog(
            this.paginator.pageSize,
            this.paginator.pageIndex,
            this.sort.direction,
            this.sort.active,
          ).pipe(catchError(() => of(null)));
        }),
        map((data) => {
          if (data === null) {
            return [];
          }
          // Only refresh the result length if there is new data. In case of rate
          // limit errors, we do not want to reset the paginator to zero, as that
          // would prevent users from re-triggering requests.
          this.resultsLength = data.totalElements;
          return data.content;
        })
      )
      .subscribe((data) => (this.logs = data));
  }


// .subscribe(page => {
//   this.logs = page.content;
//   this.resultsLength = page.totalElements;
// }
  findTaskLog(pageSize: number,
              pageNumber: number,
              order: SortDirection,
              prop: string) {
    return this.httpClient.get<Page<TaskLog>>(environment.resourceServer + "/taskLog", {
      params: {
        "page.size": pageSize,
        "page.number": pageNumber,
        "page.properties": prop,
        "page.direction": order.toUpperCase()
      }
    });
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
