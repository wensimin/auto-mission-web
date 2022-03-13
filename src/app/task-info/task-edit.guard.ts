import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree} from '@angular/router';
import {firstValueFrom, Observable} from 'rxjs';
import {TaskInfoComponent} from "./task-info.component";
import {ConfirmDialogComponent} from "../confirm-dialog/confirm-dialog.component";
import {MatDialog} from "@angular/material/dialog";

@Injectable({
  providedIn: 'root'
})
export class TaskEditGuard implements CanDeactivate<TaskInfoComponent> {

  constructor(private dialog:MatDialog) {
  }

  canDeactivate(component: TaskInfoComponent, currentRoute: ActivatedRouteSnapshot, currentState: RouterStateSnapshot, nextState?: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if(component.isEdited){
      return firstValueFrom(this.dialog.open(ConfirmDialogComponent, {
        data: ["数据未保存,确认退出吗"]
      }).afterClosed()).then()
    }
    return true;
  }

}
