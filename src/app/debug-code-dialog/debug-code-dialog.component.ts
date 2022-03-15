import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {interval, startWith, Subscription, switchMap} from "rxjs";

@Component({
  selector: 'app-debug-code-dialog',
  templateUrl: './debug-code-dialog.component.html',
  styleUrls: ['./debug-code-dialog.component.css']
})
export class DebugCodeDialogComponent implements OnInit {

  private timeInterval: Subscription | undefined;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DebugResult,
    private httpClient: HttpClient,
    dialogRef: MatDialogRef<DebugCodeDialogComponent>
  ) {
    // 不允许点击dialog外关闭
    dialogRef.disableClose = true
  }

  ngOnInit(): void {
    this.setPolling()
  }

  ngOnDestroy(): void {
    this.removePolling()
  }

  stop() {
    this.httpClient.delete<DebugResult>(`${environment.resourceServer}/debug/${this.data.id}`).subscribe(res => {
      this.setData(res)
      this.removePolling()
    })
  }

  private setData(res?: DebugResult) {
    this.data = res ? res : {
      id: this.data.id,
      end: true,
      consoleText: this.data.consoleText + "\n 任务已经结束"
    }

  }

  /**
   * 设置轮询
   */
  private setPolling() {
    this.timeInterval = interval(1000)
      .pipe(
        startWith(0),
        switchMap(() => this.httpClient.get<DebugResult>(`${environment.resourceServer}/debug/${this.data.id}`))
      ).subscribe(res => {
        this.setData(res)
        // end则结束轮询
        if (this.data.end) this.removePolling()
      })
  }

  /**
   * 注销轮询
   */
  private removePolling() {
    this.timeInterval?.unsubscribe()
  }

}

interface DebugResult {
  id: String
  end: Boolean
  consoleText: String
}
