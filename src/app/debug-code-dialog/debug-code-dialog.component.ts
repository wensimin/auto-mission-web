import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";

@Component({
  selector: 'app-debug-code-dialog',
  templateUrl: './debug-code-dialog.component.html',
  styleUrls: ['./debug-code-dialog.component.css']
})
export class DebugCodeDialogComponent implements OnInit {

  connect: WebSocket
  log: String = ""
  isOver: Boolean = false

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DebugInput,
    private httpClient: HttpClient,
    dialogRef: MatDialogRef<DebugCodeDialogComponent>
  ) {
    // 不允许点击dialog外关闭
    dialogRef.disableClose = true
    this.connect = new WebSocket(`${environment.wsServer}/debug-ws?${data.token}`)
    this.connect.onmessage = message => {
      this.log += "\n" + message.data
    }
    this.connect.onopen = _ => {
      this.connect.send(this.data.code)
    }
    this.connect.onclose = _ => {
      this.log += "\n任务已经结束"
      this.isOver = true
    }
  }


  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

  stop() {
    this.connect.close()
  }


}


interface DebugInput {
  token: string,
  code: string
}
