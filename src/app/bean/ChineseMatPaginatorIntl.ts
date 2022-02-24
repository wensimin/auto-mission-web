import {Injectable} from "@angular/core";
import {MatPaginatorIntl} from "@angular/material/paginator";
import {Subject} from "rxjs";

@Injectable()
export class ChinesePaginatorIntl implements MatPaginatorIntl {
  changes = new Subject<void>();
  firstPageLabel = `第一页`;
  itemsPerPageLabel = `每页显示条数 :`;
  lastPageLabel = `最后一页`;
  nextPageLabel = '下一页';
  previousPageLabel = '前一页';

  getRangeLabel(page: number, pageSize: number, length: number): string {
    if (length === 0) {
      return '第1页,共有1页';
    }
    const amountPages = Math.ceil(length / pageSize);
    return `第 ${page + 1}页 ,共有 ${amountPages} 页`;
  }
}
