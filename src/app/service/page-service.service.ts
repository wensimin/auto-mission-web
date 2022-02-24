import {Injectable} from '@angular/core';
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";
import {FormGroup} from "@angular/forms";
import {catchError, debounceTime, distinctUntilChanged, merge, of, startWith, switchMap} from "rxjs";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {MatSnackBar} from "@angular/material/snack-bar";
import {SnackBarComponent} from "../snack-bar/snack-bar.component";

@Injectable({
  providedIn: 'root'
})
export class PageServiceService {
  constructor(private httpClient: HttpClient, private snackBar: MatSnackBar) {
  }


  /**
   * 建立page obs
   * @param endpoint 目标端点
   * @param queryForm 查询参数
   * @param paginator 分页参数
   * @param sort 排序参数
   */
  page<T>(endpoint: String, queryForm: FormGroup, paginator: MatPaginator, sort: MatSort) {
    // 查询参数做防抖与去重
    let queryObs = queryForm.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    )
    //设置 变更查询&排序时重置页码
    merge(queryObs, sort.sortChange).subscribe(() => paginator.pageIndex = 0)
    // 建立查询obs
    return merge(queryObs, sort.sortChange, paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          let value = this.toPageParam(paginator, sort, queryForm.value);
          return this.httpClient.get<Page<T>>(`${environment.resourceServer}/${endpoint}`, {
            params: value
            //全局error处理
          }).pipe(catchError(() => {
              this.snackBar.openFromComponent(SnackBarComponent, {
                duration: 5 * 1000,
                panelClass: ['snack-bar'],
                data: {type: "error", message: "请求发生未知错误"}
              })
              return of({"totalElements": 0, "content": []})
            }
          ));
        }),
      )
  }

  /**
   * 转换object中的时间对象
   */
  toParam(value: object) {
    let param = new Map()
    Object.entries(value).forEach((item) => {
      let k = item[0]
      let v = item[1]
      //跳过空参数
      if (!v)
        return
      // 可以format为日期的format
      if (v.format) {
        v = v.format("YYYY-MM-DD HH:mm:ss")
      }
      param.set(k, v)
    })
    return Object.fromEntries(param)
  }


  /**
   * 转换成page查询参数
   * @param paginator
   * @param sort
   * @param value
   */
  toPageParam(paginator: MatPaginator, sort: MatSort, value?: object) {
    let pageParam = {
      "page.size": paginator.pageSize,
      "page.number": paginator.pageIndex,
      "page.direction": `${sort.active} ${sort.direction}`
    }
    // 合并普通参数和page参数
    return value ? Object.assign(pageParam, this.toParam(value)) : pageParam
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
