import {AfterViewInit, Component, EventEmitter, ViewChild} from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {PageServiceService} from "../service/page-service.service";
import {NGXLogger} from "ngx-logger";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatDialog} from "@angular/material/dialog";
import {firstValueFrom} from "rxjs";
import {ConfirmDialogComponent} from "../confirm-dialog/confirm-dialog.component";
import {EditStoreDialogComponent} from "./edit-store-dialog/edit-store-dialog.component";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {LoadingService} from "../service/loading.service";
import {SnackBarServiceService} from "../service/snack-bar-service.service";
import {Store} from "../model/Models";

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss']
})
export class StoreComponent implements AfterViewInit {
  queryForm = this.fb.group({
    key: ['']
  })
  resultsLength: number = 0;
  stores: Store[] = []
  displayedColumns: string[] = ['key', 'value', 'action'];
  queryEmitter = new EventEmitter()
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private fb: FormBuilder,
    private pageService: PageServiceService,
    private logger: NGXLogger,
    private dialog: MatDialog,
    private httpClient: HttpClient,
    private loadingService: LoadingService,
    private snackBarServiceService: SnackBarServiceService,
  ) {
  }

  ngAfterViewInit(): void {
    this.logger.debug("store init!")
    this.pageService
      .page<Store>("store", this.queryForm, this.paginator, this.sort, this.queryEmitter)
      .subscribe(page => {
        this.resultsLength = page.totalElements
        this.stores = page.content
      })
  }

  async openEdit(store?: Store) {
    let updated = await firstValueFrom(this.dialog.open(EditStoreDialogComponent, {
      data: store,
      autoFocus: false
    }).afterClosed()).then()
    this.logger.debug(`store need updated ${updated}`)
    if (updated) this.queryEmitter.emit()
  }

  async deleteStore(store: Store) {
    let confirm = await firstValueFrom(this.dialog.open(ConfirmDialogComponent, {
      data: `确认删除key:${store.key} 的store吗?`
    }).afterClosed()).then()
    if (!confirm) return
    this.httpClient.delete(`${environment.resourceServer}/store/${store.key}`)
      .pipe(this.loadingService.setLoading())
      .subscribe(() => {
          this.snackBarServiceService.message({type: "success", message: "删除成功"})
          this.queryEmitter.emit()
        }
      )
  }
}


