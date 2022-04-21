import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, FormGroup} from "@angular/forms";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {LoadingService} from "../../service/loading.service";
import {SnackBarServiceService} from "../../service/snack-bar-service.service";
import {Store} from "../../model/Models";

@Component({
  selector: 'app-edit-store-dialog',
  templateUrl: './edit-store-dialog.component.html',
  styleUrls: ['./edit-store-dialog.component.scss']
})
export class EditStoreDialogComponent implements OnInit {

  isNew = true
  storeForm: FormGroup = this.fb.group(new Store())
  //short ref
  f = this.storeForm.controls

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditStoreDialogComponent>,
    private httpClient: HttpClient,
    private loadingService: LoadingService,
    private snackBarServiceService: SnackBarServiceService,
    @Inject(MAT_DIALOG_DATA) public data?: Store,
  ) {
    this.isNew = data?.key == undefined
    this.storeForm = this.fb.group(data ?? new Store())
    this.f = this.storeForm.controls
    // 不允许点击dialog外关闭
    dialogRef.disableClose = true
  }

  ngOnInit(): void {
  }

  saveStore() {
    //save时 进行touch 触发验证错误消息显示
    for (let fKey in this.f) {
      this.f[fKey].markAsTouched()
    }
    if (this.storeForm.invalid) return
    this.httpClient.put(`${environment.resourceServer}/store`, this.storeForm.value)
      .pipe(this.loadingService.setLoading())
      .subscribe(() => {
          this.snackBarServiceService.message({type: "success", message: "保存store成功"})
          this.dialogRef.close(true)
        }
      )
  }

}
