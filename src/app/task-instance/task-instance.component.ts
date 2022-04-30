import {AfterViewInit, Component} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {FormControl} from "@angular/forms";
import {firstValueFrom, interval, Subscription} from "rxjs";
import {ConfirmDialogComponent} from "../confirm-dialog/confirm-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {MessageDialogComponent} from "../message-dialog/message-dialog.component";

@Component({
  selector: 'app-task-instance',
  templateUrl: './task-instance.component.html',
  styleUrls: ['./task-instance.component.scss']
})
export class TaskInstanceComponent implements AfterViewInit {
  instances: TaskInstance[] = [];
  displayedColumns: string[] = ['name', 'createDate', 'schedule', 'delayMessage', 'state', 'action'];
  done: FormControl = new FormControl(false);
  private timeInterval: Subscription | undefined;

  constructor(
    private httpClient: HttpClient,
    private dialog: MatDialog) {
  }


  ngAfterViewInit(): void {
    this.getData()
    this.done.valueChanges.subscribe(() => {
      this.getData()
    })
    this.timeInterval = interval(2000).subscribe(() => {
      this.getData()
    })
  }

  ngOnDestroy(): void {
    this.timeInterval?.unsubscribe()
  }

  private getData() {
    this.httpClient.get<TaskInstance[]>(`${environment.resourceServer}/task/instance?done=${this.done.value ?? ''}`)
      .subscribe(res => {
          this.instances = res
        }
      )
  }


  async stopInstance(instance: TaskInstance) {
    let confirm = await firstValueFrom(this.dialog.open(ConfirmDialogComponent, {
      data: `确认停止本任务实例吗?`
    }).afterClosed()).then()
    if (!confirm) return
    this.httpClient.put(`${environment.resourceServer}/task/instance/${instance.key}`, {})
      .subscribe(() => {
        this.getData()
      })
  }

  showCode(instance: TaskInstance) {
    this.dialog.open(MessageDialogComponent, {data: instance.code})
  }

  async clearTask() {
    let confirm = await firstValueFrom(this.dialog.open(ConfirmDialogComponent, {
      data: `确认清除所有已完成任务实例吗?`
    }).afterClosed()).then()
    if (!confirm) return
    this.httpClient.delete(`${environment.resourceServer}/task/instance`, {})
      .subscribe(() => {
        this.getData()
      })
  }

}

class TaskInstance {
  key: String | null = null
  name: String | null = null
  code: String | null = null
  done: Boolean | null = null
  createDate: String | null = null
  schedule: Boolean | null = null
  delayMessage: String | null = null
  running: Boolean | null = null
}

