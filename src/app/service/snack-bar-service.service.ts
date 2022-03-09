import {Injectable} from '@angular/core';
import {MatSnackBar} from "@angular/material/snack-bar";
import {SnackBarComponent, SnackBarConfig} from "../snack-bar/snack-bar.component";

@Injectable({
  providedIn: 'root'
})
export class SnackBarServiceService {

  constructor(private snackBar: MatSnackBar) {
  }

  message(config: SnackBarConfig) {
    this.snackBar.openFromComponent(SnackBarComponent, {
      duration: 5 * 1000,
      panelClass: ['snack-bar'],
      data: config
    })
  }
}
